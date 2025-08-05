'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo_navbar from '../../../../public/logo_navbar.png'
import cart_icon from '../../../../public/cart.png'
import menu_icon from '../../../../public/menu.png'
import CartModal from './CartModal';
import ProductSearchBar from './ProductSearchBar';
export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Lessons', href: '/lessons' },
    { name: 'Courses', href: '/courses' },
    { name: 'Consulting', href: '/consulting' },
    { name: 'About', href: '/about' },
  ];
  const isActive = (href: string) => pathname === href;
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full bg-white text-black shadow-sm border-b border-gray-200">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between px-16 py-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src={logo_navbar} alt="Logo" height={30} />
          </Link>
        </div>
        {/* Middle: Nav Links */}
        <div className="flex space-x-6 text-base">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline underline-offset-4 ${isActive(item.href) ? 'text-navbar underline' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* Right: Search & Cart */}
        <div className="flex items-center">
          <ProductSearchBar />
          {/* Cart Button with Relative Positioning */}
          <div className="relative ml-4">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Image src={cart_icon} alt="Cart" height={20} />
            </button>

            {/* Cart Modal positioned relative to cart button */}
            <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        {/* LEFT: Hamburger + Search */}
        <div className="flex items-center gap-x-3">
          <button onClick={() => setMenuOpen(true)} className="focus:outline-none" aria-label="Open menu">
            <Image src={menu_icon} alt="Menu" width={26} height={26} />
          </button>
        </div>
        {/* RIGHT: Cart */}
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2">
            <ProductSearchBar />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="ml-2 text-xl">
              ✕
            </button>
          </div>

          {/* Mobile Cart Button with Relative Positioning */}
          <div className="relative">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <Image src={cart_icon} alt="Cart" width={22} height={22} />
            </button>

            {/* Cart Modal for Mobile */}
            <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      </div>

      {/* Search Modal (Mobile only) */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex md:hidden" onClick={() => setSearchOpen(false)}>
          <div className="bg-white w-full py-6 px-4 shadow" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-x-2">
              <input
                autoFocus
                type="text"
                placeholder="Search"
                className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-base"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="ml-2 text-xl">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Hamburger menu) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg p-6" onClick={e => e.stopPropagation()}>
            <button className="mb-6" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg font-medium ${isActive(item.href) ? 'text-navbar underline' : 'text-gray-700'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}