'use client';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ session }: { session: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center">
              Oferta<span className="text-romanianYellow">Fulger</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/categories" className="text-gray-700 hover:text-primary">Categorii</Link>
            <Link href="/deals" className="text-gray-700 hover:text-primary">Oferte</Link>
            <Link href="/merchants" className="text-gray-700 hover:text-primary">Magazine</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary">Despre Noi</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              {session ? (
                <LogoutButton />
              ) : (
                <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90">Conectează-te</Link>
              )}
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-gray-700">
              <FontAwesomeIcon icon={faBars} className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 transform transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-xl font-bold text-primary">OfertaFulger</Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-700">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <nav className="space-y-2">
            <Link href="/categories" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Categorii</Link>
            <Link href="/deals" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Oferte</Link>
            <Link href="/merchants" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Magazine</Link>
            <Link href="/about" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Despre Noi</Link>
            {session ? (
              <LogoutButton />
            ) : (
              <>
                <Link href="/login" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Conectează-te</Link>
                <Link href="/signup" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Creează cont</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      </header>
  );
};

export default Header;
