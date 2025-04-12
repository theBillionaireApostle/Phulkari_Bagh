"use client"; // This entire file is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // for redirect
import Dashboard from "./Dashboard.client";

// Define a Product interface matching what your API returns
interface Product {
  _id: string;
  name: string;
  price: number;
  // ...other fields
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter(); // We'll use this to redirect client-side

  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      console.warn("No token found in localStorage. Redirecting to /admin/login...");
      // Redirect the user to /admin/login if not logged in
      router.push("/admin/login");
      return;
    }

    // If token is found, fetch products with Authorization header
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
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        // Optionally handle fetch error: show a message or re-redirect
      });
  }, [router]);

  return <Dashboard products={products} />;
}
