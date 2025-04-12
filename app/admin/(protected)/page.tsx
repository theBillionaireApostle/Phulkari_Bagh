// app/admin/(protected)/page.tsx
import Dashboard from "./Dashboard.client"; // Import the client component

export const metadata = {
  title: "Admin Dashboard | Phulkari Bagh",
  description: "Manage products for Phulkari Bagh",
};

// Server-side function to fetch products.
async function getProducts() {
  // Use the provided production backend URL
  const baseUrl = "https://phulkari-bagh-backend.vercel.app";
  const url = new URL("/api/products", baseUrl).toString();
  
  // Optionally add credentials if your API requires them
  const res = await fetch(url, {
    cache: "no-store",
    // credentials: "include", // Uncomment this line if cookies or credentials are needed
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export default async function AdminDashboardPage() {
  const products = await getProducts();
  return <Dashboard products={products} />;
}
