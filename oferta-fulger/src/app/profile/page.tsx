import { redirect } from 'next/navigation';
import { getSession } from '@/app/auth/session';
import LogoutButton from '@/components/LogoutButton';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Profilul Meu</h1>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
        <p className="text-lg mb-4">
          <strong>Email:</strong> {session.user.email}
        </p>
        {session.user.user_metadata?.full_name && (
          <p className="text-lg mb-4">
            <strong>Nume complet:</strong> {session.user.user_metadata.full_name}
          </p>
        )}
        <p className="text-lg mb-6">
          <strong>ID Utilizator:</strong> {session.user.id}
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
