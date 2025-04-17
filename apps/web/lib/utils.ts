import bcrypt from 'bcryptjs';
import { ErrorType, RoutePath } from '@/lib/constants';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export function saltAndHashPassword(password: string) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function access(roles: string[]) {
  const session = await auth();
  if (!roles.some((role) => role === session?.user?.role)) {
    const url = new URL(RoutePath.ERROR_URL, process.env.BASE_URL);
    url.searchParams.append('error', ErrorType.ACCESS_DENIED);
    redirect(url.href);
  }
}
