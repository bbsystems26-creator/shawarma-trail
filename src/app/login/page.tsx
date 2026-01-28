import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "התחברות | שווארמה ביס",
  description: "התחברו לחשבון שווארמה ביס שלכם",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="שווארמה ביס"
              className="h-20 mx-auto"
            />
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
