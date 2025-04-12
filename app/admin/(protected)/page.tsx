"use client"; // Mark this entire file as a client component

import { useEffect, useState } from "react";
import Dashboard from "./Dashboard.client";

// 1. Define a Product interface matching the data you expect
interface Product {
  _id: string;
  name: string;
  price: number;
  // ... add other fields as needed
}

export default function AdminDashboardPage() {
  // 2. Use Product[] instead of any[]
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      console.warn("No token found in localStorage.");
      // Optionally redirect or show an error message
      return;
    }

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
      .then((data: Product[]) => {
        // 3. Data is typed as Product[], store in state
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        // handle fetch error — possibly show a message or redirect
      });
  }, []);

  return <Dashboard products={products} />;
}
