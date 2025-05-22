import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import * as React from 'react';
import ClientLayoutWrapper from './components/client-layout-wrapper';
import { RoutePath, ErrorType } from '@/lib/constants';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect(`${RoutePath.ERROR_URL}?error=${ErrorType.ACCESS_DENIED}`);
  } else if (session.error) {
    redirect(`${RoutePath.ERROR_URL}?error=${session.error}`);
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
