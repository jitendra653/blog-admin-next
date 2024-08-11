import LoginForm from "@/components/login/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
      redirect("/admin");
      return null;
    }
    return (
      <main>
        <LoginForm />
      </main>
    );
};

export default Home;