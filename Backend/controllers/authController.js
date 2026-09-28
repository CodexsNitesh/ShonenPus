require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { Resend } = require("resend");
const User = require("../models/user");
const Otp = require("../models/otp");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  cart: user.cart,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
});

const getRandomPasswordHash = async () => {
  return bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
};

const sendAuthResponse = (res, user, message = "Login successful", status = 200) => {
  const token = createToken(user);
  return res.status(status).json({
    message,
    token,
    user: getSafeUser(user),
  });
};

exports.postSignUp = async (req, res) => {
  const { name, email, password, cart = [] } = req.body;
  try {
    const normalizedEmail = String(email || "").toLowerCase().trim();
    const checkExisting = await User.findOne({ email: normalizedEmail });
    if (checkExisting) {
      return res.status(409).json({ message: "Email has been already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      cart,
      authProvider: "password",
    });
    await newUser.save();

    return sendAuthResponse(res, newUser, "SignUp successful", 201);
  } catch (err) {
    res.status(500).json({ message: "Sign up has been failed", error: err.message });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email || "").toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(409).json({ message: "Invalid credentials" });
    }

    const passwordMatches =
      (await bcrypt.compare(password, user.password).catch(() => false)) ||
      user.password === password;

    if (!passwordMatches) {
      return res.status(409).json({ message: "Invalid credentials" });
    }

    if (user.password === password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    return sendAuthResponse(res, user);
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};

exports.requestOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otpHash, expiresAt });

    if (!resend) {
      console.log(`OTP for ${email}: ${otp}`);
      return res.json({
        success: true,
        message: "OTP generated. Add RESEND_API_KEY to send it by email.",
        devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
      });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "TrencShop <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Your TrencShop login code",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>Your TrencShop verification code</h2>
          <p>Use this code to finish signing in:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Could not send OTP email",
      });
    }

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Could not request OTP", error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const otp = String(req.body.otp || "").trim();

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new code." });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: "Too many attempts. Please request a new code." });
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValidOtp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: email.split("@")[0],
        email,
        password: await getRandomPasswordHash(),
        authProvider: "otp",
        isEmailVerified: true,
      });
    } else {
      user.isEmailVerified = true;
      if (user.authProvider === "password") {
        user.authProvider = "otp";
      }
      await user.save();
    }

    return sendAuthResponse(res, user, "OTP verified");
  } catch (err) {
    res.status(500).json({ message: "Could not verify OTP", error: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email not found" });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        password: await getRandomPasswordHash(),
        authProvider: "google",
        googleId: payload.sub,
        isEmailVerified: Boolean(payload.email_verified),
      });
    } else {
      user.name = user.name || payload.name || email.split("@")[0];
      user.googleId = user.googleId || payload.sub;
      user.authProvider = "google";
      user.isEmailVerified = user.isEmailVerified || Boolean(payload.email_verified);
      await user.save();
    }

    return sendAuthResponse(res, user, "Google login successful");
  } catch (err) {
    res.status(401).json({ message: "Google login failed", error: err.message });
  }
};
