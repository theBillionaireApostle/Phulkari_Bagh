"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./Dashboard.client";

// Type matching your /api/products response
interface Product {
  _id: string;
  name: string;
  price: number;
  // ... additional fields
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");

    // 1) If no token in localStorage, redirect to login
    if (!token) {
      console.warn("No token found. Redirecting to /admin/login...");
      router.push("/admin/login");
      return;
    }

    // 2) If token is present, fetch products with an Authorization header
    fetch("https://phulkari-bagh-backend.vercel.app/api/products", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // attach token
      },
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products. Possibly invalid token?");
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        // Optionally redirect or show error message
        // router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // 3) Render the Dashboard if we have products and no error
  return <Dashboard products={products} />;
}
