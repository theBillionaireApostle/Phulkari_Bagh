"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./Dashboard.client";

interface Product {
  _id: string;
  name: string;
  price: number;
  // ... add other fields as needed
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Since /api/products doesn't need a token, no need to check localStorage or set Authorization
    fetch("https://phulkari-bagh-backend.vercel.app/api/products", {
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
        console.error("Error fetching products:", err);
        // Optionally handle fetch error: show a message, redirect, etc.
      });
  }, [router]);

  return <Dashboard products={products} />;
}
