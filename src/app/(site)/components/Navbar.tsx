'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo_navbar from '../../../../public/logo_navbar.png'
import search_icon from '../../../../public/search.png'
import cart_icon from '../../../../public/cart.png'
import CartModal from './CartModal';
export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Lessons', href: '/lessons' },
    { name: 'Courses', href: '/courses' },
    { name: 'Consulting', href: '/consulting' },
    { name: 'About', href: '/about' },
    // { name: 'dashboard', href: '/dashboard' },
  ];

  const isActive = (href: string) => pathname === href;
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <nav className="w-full flex items-center justify-between px-15 py-4 bg-white text-black">
      {/* Left: Logo & Brand */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image src={logo_navbar} alt="Logo" height={30} />
        </Link>
      </div>

      {/* Middle: Nav Links */}
      <div className="hidden md:flex space-x-6 text-base">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:underline underline-offset-4 ${isActive(item.href) ? 'text-navbar underline' : ''
              }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right: Search and Cart */}
      <div className="flex items-center ">
        <div className="relative mr-4">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
          />
          <Image
            src={search_icon}
            alt="Search"
            width={16}
            height={16}
            className="absolute left-3 top-2.5 opacity-70"
          />
        </div>
        {/* <Link href="/cart">
          <Image src={cart_icon} alt="Cart" height={20} />

        </Link> */}
        <button onClick={() => setCartOpen(true)} className="focus:outline-none">
          <Image src={cart_icon} alt="Cart" height={20} />
        </button>
        <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </nav>
  );
}
