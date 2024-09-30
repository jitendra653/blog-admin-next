import Sidebar from "@/components/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {

  return (
    <main className="flex">
      <ToastContainer />
      <div className="w-max">
        <Sidebar />
      </div>
      <div className="w-4/5">
      
      <header className="flex justify-between items-center mb-6 p-10  border-b">
        <div>
          <h2 className="text-3xl font-bold">Blog</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
       </header>
      {children}</div>
    </main>
  );
};

export default Layout;
