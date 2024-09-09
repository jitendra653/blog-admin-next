import React from "react";
import ClientLayout from "./ClientLayout";
import "./globals.css";
 
export const metadata = {
  title: "Blog Admin",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
