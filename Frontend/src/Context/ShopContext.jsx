import React, { useState, useEffect, useMemo } from "react";
import fallbackProducts from "../assets/all_product";
import { ShopContext } from "./ShopContextValue";

export { ShopContext } from "./ShopContextValue";

const API_URL = "http://localhost:3000";
const CART_STORAGE_KEY = "trencshop_cart";

const getCartKey = (productId, size = "M") => `${Number(productId)}:${String(size).toUpperCase()}`;

const parseCartKey = (cartKey) => {
  const [productId, size = "M"] = String(cartKey).split(":");
  return {
    productId: Number(productId),
    size: size.toUpperCase(),
  };
};

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState(fallbackProducts);
  const [cartItems, setCartItems] = useState(getStoredCart);

  useEffect(() => {
    fetchProducts();
    if (localStorage.getItem("token")) {
      fetchUserCart();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProducts = () => {
    fetch(`${API_URL}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setAll_Product(data);
      })
      .catch(() => {});
  };

  const fetchUserCart = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/getcart`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.cart)) return;
        const updatedCart = {};
        data.cart.forEach((item) => {
          const key = getCartKey(item.productId, item.size);
          updatedCart[key] = Number(updatedCart[key] || 0) + Number(item.quantity || 0);
        });
        setCartItems((localCart) => ({ ...localCart, ...updatedCart }));
      })
      .catch((err) => console.error("Failed to fetch user cart:", err));
  };

  const addToCart = (itemId, size = "M", quantity = 1) => {
    const token = localStorage.getItem("token");
    const productId = Number(itemId);
    const selectedSize = String(size).toUpperCase();
    const safeQuantity = Math.max(1, Number(quantity || 1));
    const cartKey = getCartKey(productId, selectedSize);

    setCartItems((prev) => ({
      ...prev,
      [cartKey]: Number(prev[cartKey] || 0) + safeQuantity,
    }));

    if (!token) return;

    fetch(`${API_URL}/addtocart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, size: selectedSize, quantity: safeQuantity }),
    }).then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:expired"));
      }
    }).catch((err) => console.log("Error found:", err));
  };

  const removeFromCart = (cartKeyOrProductId, size = "M") => {
    const token = localStorage.getItem("token");
    const isCartKey = String(cartKeyOrProductId).includes(":");
    const { productId, size: selectedSize } = isCartKey
      ? parseCartKey(cartKeyOrProductId)
      : { productId: Number(cartKeyOrProductId), size: String(size).toUpperCase() };
    const cartKey = getCartKey(productId, selectedSize);

    setCartItems((prev) => {
      const nextQuantity = Math.max(Number(prev[cartKey] || 0) - 1, 0);
      const updated = { ...prev };
      if (nextQuantity > 0) {
        updated[cartKey] = nextQuantity;
      } else {
        delete updated[cartKey];
      }
      return updated;
    });

    if (!token) return;

    fetch(`${API_URL}/removefromcart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, size: selectedSize }),
    }).then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:expired"));
      }
    }).catch((err) => console.error("Failed to remove from the cart", err));
  };

  const clearCart = () => {
    const token = localStorage.getItem("token");
    setCartItems({});
    localStorage.removeItem(CART_STORAGE_KEY);

    if (!token) return;

    fetch(`${API_URL}/clearcart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:expired"));
      }
    }).catch((err) => console.error("Failed to clear cart", err));
  };

  const syncCartToServer = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cartEntries = Object.entries(cartItems).filter(([, quantity]) => quantity > 0);
    const responses = await Promise.all(
      cartEntries.map(([cartKey, quantity]) => {
        const { productId, size } = parseCartKey(cartKey);
        return fetch(`${API_URL}/addtocart`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, size, quantity }),
        });
      })
    );
    const failedResponse = responses.find((response) => !response.ok);
    if (failedResponse) {
      if (failedResponse.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:expired"));
        throw new Error("Your session expired. Please sign in again.");
      }
      throw new Error("Could not sync your cart. Please try again.");
    }
  };

  const cartRows = useMemo(() => {
    return Object.entries(cartItems)
      .map(([cartKey, quantity]) => {
        const { productId, size } = parseCartKey(cartKey);
        const product = all_product.find((p) => p.id === productId);
        return {
          cartKey,
          productId,
          size,
          quantity,
          product,
        };
      })
      .filter((item) => item.quantity > 0 && item.product);
  }, [all_product, cartItems]);

  const getTotalCartAmount = () => {
    return cartRows.reduce(
      (total, item) => total + item.product.new_price * item.quantity,
      0
    );
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + Number(qty || 0), 0);
  };

  const contextValue = {
    all_product,
    cartItems,
    cartRows,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItems,
    fetchUserCart,
    syncCartToServer,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
