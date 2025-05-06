'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientLayout = dynamic(
  () => import('./client-layout'),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function ClientLayoutWrapper({ children, session }: { children: React.ReactNode, session: any }) {
  return (<Suspense fallback={<div>Loading...</div>}>
    <ClientLayout session={session}>{children}</ClientLayout>
  </Suspense>);
}
