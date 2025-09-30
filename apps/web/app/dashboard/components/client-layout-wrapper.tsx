'use client';

import { createContext, Suspense, useContext, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';
import { storage } from '@/lib/storage';
import { EventType, TOKEN_STORAGE_KEY } from '@/lib/constants';
import { ErrorBoundary } from '@/components/error/error-boundary';
import { GlobalErrorHandler } from '@/components/error/global-error-handler';
import { CustomEventBus } from '@/lib/event';
import { App } from 'antd';
import { Request } from '@/lib/request';

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
  const { message } = App.useApp();

  useLayoutEffect(() => {
    CustomEventBus.on<string>(EventType.REQUEST_ERROR, (error) => {
      message.error(error);
    });
  }, []);

  useLayoutEffect(() => {
    if (session?.accessToken) {
      Request.token = session.accessToken;
      storage.set(TOKEN_STORAGE_KEY, session.accessToken);
    } else {
      Request.token = null;
      storage.remove(TOKEN_STORAGE_KEY);
    }
  }, [session?.accessToken]);

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
      <GlobalErrorHandler>
        <SessionContext value={session}>
          <ErrorBoundary>
            <ClientLayoutWrapperInner>{children}</ClientLayoutWrapperInner>
          </ErrorBoundary>
        </SessionContext>
      </GlobalErrorHandler>
    </App>
  );
}
