"use client"; // Mark this entire file as a client component

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard.client";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Read token from localStorage
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      // handle no token — maybe redirect or show an error
      console.warn("No token found in localStorage.");
      return;
    }

    // 2. Fetch products with Authorization header
    fetch("https://phulkari-bagh-backend.vercel.app/api/products", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        // 3. Store them in state
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        // handle fetch error — possibly show a message or redirect
      });
  }, []);

  return <Dashboard products={products} />;
}
