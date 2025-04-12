"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSpinner, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";
import styles from "./cart.module.css";

// Define a TypeScript interface for your cart items
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional image field
}

export default function CartPage() {
  // Firebase authentication state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cart loading & data
  const [cartLoading, setCartLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");

  // Listen for Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed. Current user:", currentUser);
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load cart items from backend
  useEffect(() => {
    async function fetchCart() {
      if (user) {
        try {
          setCartLoading(true);
          console.log("Fetching cart for user:", user.uid);
          const res = await fetch(`https://phulkari-bagh-backend.vercel.app/api/cart?userId=${user.uid}`);
          if (!res.ok) throw new Error("Failed to fetch cart");
          const data = await res.json();
          console.log("Fetched cart data:", data);
          // Remove placeholder fallback; just use data.items or []
          setCartItems(data.items || []);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error fetching cart:", error.message);
            setError(error.message || "Unable to fetch cart data.");
          } else {
            console.error("Error fetching cart:", error);
            setError("Unable to fetch cart data.");
          }
          // If there's an error, default to an empty array
          setCartItems([]);
        } finally {
          setCartLoading(false);
        }
      }
    }
    fetchCart();
  }, [user]);

  // Save cart to backend whenever cartItems change
  useEffect(() => {
    async function updateCart() {
      if (user) {
        try {
          console.log("Updating cart for user:", user.uid, "with items:", cartItems);
          await fetch("https://phulkari-bagh-backend.vercel.app/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, items: cartItems }),
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error saving cart:", error.message);
          } else {
            console.error("Error saving cart:", error);
          }
        }
      }
    }
    if (cartItems.length > 0) {
      updateCart();
    }
  }, [cartItems, user]);

  // If auth or cart is still loading, show a loader
  if (authLoading || cartLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin className={styles.loaderIcon} />
        <p>Loading your cart...</p>
      </div>
    );
  }

  // If no user is logged in, show sign-in message
  if (!user) {
    return (
      <div className={styles.authRequiredContainer}>
        <div className={styles.authCard}>
          <h1>Please Sign In</h1>
          <p>You must sign in to view your cart.</p>
          <Link href="/signin" className={styles.signInLink}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Compute the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Remove item from cart
  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Increase quantity
  const incrementQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity; remove if 0
  const decrementQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev.reduce<CartItem[]>((acc, item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity - 1;
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  // Build dynamic WhatsApp message
  const getWhatsAppMessage = (): string => {
    let message = "I'm interested in the following items:\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Quantity: ${item.quantity}, Price: ₹${item.price}\n`;
    });
    message += `\nTotal Price: ₹${totalPrice}`;
    return message;
  };

  // Handler for WhatsApp enquiry
  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(getWhatsAppMessage());
    const phone = "+919510394742";
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(url, "_blank");
  };

  // Additional user navigation
  const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const getInitials = (user: User) => {
      if (user.displayName) {
        const names = user.displayName.split(" ");
        if (names.length > 1) {
          return (
            names[0].charAt(0).toUpperCase() +
            names[names.length - 1].charAt(0).toUpperCase()
          );
        }
        return names[0].charAt(0).toUpperCase();
      }
      return user.email ? user.email.charAt(0).toUpperCase() : "U";
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error signing out:", error.message);
        } else {
          console.error("Error signing out:", error);
        }
      }
    };

    return (
      <nav className={styles.nav}>
        <div className={styles.logo}>Phulkari Bagh</div>
        <div className={styles.desktopNavLinks}>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <button className={styles.hamburger} aria-label="Toggle menu">
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <div className={styles.userArea}>
          <div className={styles.userDropdown}>
            <div className={styles.userAvatar} onClick={toggleMenu}>
              {getInitials(user)}
            </div>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/cart" className={styles.dropdownItem}>
                  Cart {cartItems.length > 0 && <span className={styles.badge}>{cartItems.length}</span>}
                </Link>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.cartContainer}>
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <Link href="/" className={styles.shopLink}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.itemsContainer}>
              {cartItems.map((item) => (
                <div key={item.productId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <h2>{item.name}</h2>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.subtractButton}
                        onClick={() => decrementQuantity(item.productId)}
                        title="Decrease quantity"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <button
                        className={styles.addButton}
                        onClick={() => incrementQuantity(item.productId)}
                        title="Increase quantity"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeItem(item.productId)}
                    title="Remove item"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.total}>Total: ₹{totalPrice}</div>
            <button className={styles.whatsappButton} onClick={handleWhatsAppEnquiry}>
              <FontAwesomeIcon icon={faWhatsapp} className={styles.whatsappIcon} /> WhatsApp Enquiry
            </button>
          </>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </>
  );
}
