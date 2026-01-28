import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "הרשמה | שווארמה ביס",
  description: "הצטרפו לקהילת שווארמה ביס",
};

export default function RegisterPage() {
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

        <RegisterForm />
      </div>
    </div>
  );
}
