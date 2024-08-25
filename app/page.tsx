import LoginForm from "@/components/login/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
    return (
      <main>
        <LoginForm />
      </main>
    );
};

export default Home;