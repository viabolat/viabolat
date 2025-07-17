import { getSession } from '@/app/auth/session';
import Header from './Header';

export default async function AuthHeaderWrapper() {
  const session = await getSession();
  return <Header session={session} />;
}
