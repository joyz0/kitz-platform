'use client';

import { RoutePath } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { UnifiedErrorHandler } from '@/lib/error-handlers/error-mapping';
import type { StatusCode } from '@repo/types/enums/status-code';

function AuthError() {
  const search = useSearchParams();
  const error = search.get('error') as StatusCode;

  const errorConfig = UnifiedErrorHandler.getErrorConfig(error);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Link
        href={errorConfig.redirect}
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {errorConfig.title}
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {errorConfig.content}
        </div>
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <AuthError />
    </Suspense>
  );
}
