'use client';

import { signOut } from '@/app/auth/actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
    >
      Deconectare
    </button>
  );
}
