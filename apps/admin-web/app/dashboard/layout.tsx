import { auth } from '@/lib/auth';
import * as React from 'react';
import { headers } from 'next/headers';
import ClientLayoutWrapper from './components/client-layout-wrapper';
import { ServerErrorHandler } from '@/components/error/error-handlers';
import { AuthGuards } from '@/components/auth/auth-guards';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // 使用中心化错误处理器
  ServerErrorHandler.validateSession(session);

  // 路径感知的权限检查
  if (pathname.startsWith('/dashboard/system/')) {
    await AuthGuards.requireAdmin();
  }

  return (
    <div>
      <ClientLayoutWrapper session={session}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              session,
            });
          }
          return child;
        })}
      </ClientLayoutWrapper>
    </div>
  );
}
