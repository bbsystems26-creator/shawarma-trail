import Link from "next/link";
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                <div>
                    <h4 className="font-bold text-white">ניווט</h4>
                    <ul className="text-zinc-400 space-y-2">
                        <li><Link href="/" className="hover:underline">בית</Link></li>
                        <li><a href="#" className="hover:underline">גלול</a></li>
                        <li><a href="#" className="hover:underline">מגזין</a></li>
                        <li><a href="#" className="hover:underline">צור קשר</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white">מידע שימושי</h4>
                    <ul className="text-zinc-400 space-y-2">
                        <li><a href="#" className="hover:underline">אודות</a></li>
                        <li><a href="#" className="hover:underline">תנאי שימוש</a></li>
                        <li><a href="#" className="hover:underline">מדיניות פרטיות</a></li>
                        <li><a href="#" className="hover:underline">נגישות</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white">חיפושים פופולריים</h4>
                    <ul className="text-zinc-400 space-y-2">
                        <li><a href="#" className="hover:underline">שווארמה בתל אביב</a></li>
                        <li><a href="#" className="hover:underline">בירושלים</a></li>
                        <li><a href="#" className="hover:underline">בוחרים</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white">עקבו אחרינו</h4>
                    <div className="text-zinc-400 space-y-2">
                        <input type="email" placeholder="הרשמה לניוזלטר" className="p-2 rounded-md" />
                        <button className="bg-amber-500 text-white rounded-md px-4 py-2">שלח</button>
                        <div>© 2026 שווארמה טרייל</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;