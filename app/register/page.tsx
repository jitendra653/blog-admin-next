import RegisterForm from "@/components/register/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import type { NextPage } from "next";
import type { Session } from "next-auth";

const Register: NextPage = async () => {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (session) {
      redirect("/dashboard");
      return null;
    }
    return <RegisterForm />;
  } catch (error) {
    console.error('Error fetching session:', error);
    return <div>Error fetching session</div>;
  }
};

export default Register;
