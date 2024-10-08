import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "./mongodb";
import User from "@/models/User";
interface Credentials {
    email: string;
    password: string;
  }
  
  interface NextAuthUserWithId extends NextAuth.User {
    id?: string;
  }


  export const authOptions = {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {},
        async authorize(credentials: Credentials) {
          const { email, password } = credentials;
  
          try {
            await connectMongoDB();
            const user = await User.findOne({ email });
  
            if (!user) {
              return null;
            }
  
            const passwordsMatch = await bcrypt.compare(password, user.password);
  
            if (!passwordsMatch) {
              return null;
            }
  
            return user as NextAuthUserWithId;
          } catch (error) {
            console.error("Error: ", error);
            return null;
          }
        },
      }),
    ], 
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
  
    pages: {
      signIn: "/",
    },
    callbacks: {
      async jwt({ token, user }: { token: any; user?: NextAuthUserWithId }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
  };
  