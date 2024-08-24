import Sidebar from "@/components/sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {

  return (
    <main className="flex">
      <ToastContainer />
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-4/5">{children}</div>
    </main>
  );
};

export default Layout;
