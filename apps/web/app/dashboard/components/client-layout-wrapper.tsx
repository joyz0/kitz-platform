'use client';

import { createContext, Suspense, useContext, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';
import { storage } from '@/lib/storage';
import { EventType, TOKEN_STORAGE_KEY } from '@/lib/constants';
import ErrorBoundary from '@/components/error-boundary';
import { CustomEventBus } from '@/lib/event';
import { App } from 'antd';

const ClientLayout = dynamic(() => import('./client-layout'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const SessionContext = createContext<Session | null>(null);

export const useClientSession = () => {
  return useContext(SessionContext);
};

function ClientLayoutWrapperInner({ children }: { children: React.ReactNode }) {
  const session: Session | null = useClientSession();
  const { message, notification, modal } = App.useApp();

  useLayoutEffect(() => {
    CustomEventBus.on<string>(EventType.REQUEST_ERROR, (error) => {
      message.error(error);
    });
    if (session?.accessToken) {
      storage.set(TOKEN_STORAGE_KEY, session.accessToken);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLayout>{children}</ClientLayout>
    </Suspense>
  );
}

export default function ClientLayoutWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <App>
      <SessionContext value={session}>
        <ErrorBoundary>
          <ClientLayoutWrapperInner>{children}</ClientLayoutWrapperInner>
        </ErrorBoundary>
      </SessionContext>
    </App>
  );
}
