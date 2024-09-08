"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider } from "./Providers";
import Loader from "../components/loader/Loader";
import { observer } from "mobx-react-lite";
import loaderStore from "./stores/loaderStore";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = observer(({ children }: ClientLayoutProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (pathname) {
      setLoading(true);

      timer = setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <AuthProvider>
      {( loaderStore?.isLoading || loading) && <Loader />}
      {children}
    </AuthProvider>
  );
});

export default ClientLayout;