import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const GoogleAuthButton = ({ label = "Continue with Google" }) => {
  const { syncCartToServer } = useContext(ShopContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    try {
      setError("");
      const res = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      localStorage.setItem("token", data.token);
      await syncCartToServer();
      navigate("/");
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  if (!googleClientId) {
    return (
      <p className="text-xs text-amber-700 text-center">
        Add VITE_GOOGLE_CLIENT_ID in Frontend/.env to enable Google sign in.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <GoogleLogin
          text={label === "Sign up with Google" ? "signup_with" : "continue_with"}
          onSuccess={handleSuccess}
          onError={() => setError("Google login was cancelled or failed")}
        />
      </div>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default GoogleAuthButton;
