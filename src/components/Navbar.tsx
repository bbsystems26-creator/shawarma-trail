import Link from "next/link";
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-zinc-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-white">
                    🥙 שווארמה טרייל
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link href="/" className="text-white hover:underline">בית</Link>
                    <Link href="/explore" className="text-white hover:underline">גלה</Link>
                    <span className="text-zinc-400">מגזין</span>
                    <span className="text-zinc-400">צור קשר</span>
                </div>
                {/* Mobile hamburger will go here */}
            </div>
        </nav>
    );
};

export default Navbar;