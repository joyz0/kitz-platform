import bcrypt from 'bcryptjs';
import { ServerErrorHandler } from '@/lib/error-handlers';

export function saltAndHashPassword(password: string) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function access(roles: string[]) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  ServerErrorHandler.checkAccess(session?.user?.role, roles);
}
