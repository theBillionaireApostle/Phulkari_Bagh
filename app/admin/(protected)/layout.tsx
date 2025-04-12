// app/admin/(protected)/layout.tsx

import { ReactNode } from "react";
import "../../admin/admin.css"; // Import your admin-specific CSS

export const metadata = {
  title: "Admin Panel | Phulkari Bagh",
  description: "Admin panel for managing products, images, and orders.",
};

// Define a layout props interface
interface AdminLayoutProps {
  children: ReactNode;
}

// No server-side cookie or JWT checks here.
// The layout simply renders your content.
export default function ProtectedAdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main className="admin-main">{children}</main>
      </body>
    </html>
  );
}
