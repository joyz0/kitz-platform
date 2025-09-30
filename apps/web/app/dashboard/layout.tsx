import { auth } from '@/lib/auth';
import * as React from 'react';
import ClientLayoutWrapper from './components/client-layout-wrapper';
import { ServerErrorHandler } from '@/components/error/error-handlers';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // 使用中心化错误处理器
  ServerErrorHandler.validateSession(session);

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
