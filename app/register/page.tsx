import RegisterForm from "@/components/register/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { NextPage } from "next";
import type { Session } from "next-auth";
import React from "react";

const Register: NextPage = async () => {
  try {
    return <RegisterForm />;
  } catch (error) {
    console.error('Error fetching session:', error);
    return <div>Error fetching session</div>;
  }
};

export default Register;
