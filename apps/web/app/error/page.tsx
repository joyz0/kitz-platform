'use client';

import { ErrorType, RoutePath } from '@/lib/constants';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMap = {
  [ErrorType.CONFIGURATION]: {
    title: '服务器异常',
    redirect: RoutePath.INDEX,
    content: (
      <p>
        服务器异常。 错误码{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">
          {ErrorType.CONFIGURATION}
        </code>
      </p>
    ),
  },
  [ErrorType.ACCESS_DENIED]: {
    title: '访问受限',
    redirect: RoutePath.INDEX,
    content: (
      <p>
        没有权限访问该资源。 错误码{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">
          {ErrorType.ACCESS_DENIED}
        </code>
      </p>
    ),
  },
  [ErrorType.VERIFICATION]: {
    title: '邮箱验证失败',
    redirect: RoutePath.INDEX,
    content: (
      <p>
        邮箱验证链接已失效。 错误码{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">
          {ErrorType.VERIFICATION}
        </code>
      </p>
    ),
  },
  [ErrorType.CREDENTIALS_SIGNIN]: {
    title: '登录失败',
    redirect: RoutePath.SIGNIN_URL,
    content: (
      <p>
        请检查登录信息是否正确。 错误码{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">
          {ErrorType.CREDENTIALS_SIGNIN}
        </code>
      </p>
    ),
  },
  [ErrorType.DEFAULT]: {
    title: '报错啦',
    redirect: RoutePath.INDEX,
    content: (
      <p>
        未知错误。 错误码{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">
          {ErrorType.DEFAULT}
        </code>
      </p>
    ),
  },
};

function AuthError() {
  const search = useSearchParams();
  const error = search.get('error') as ErrorType;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Link
        href={errorMap[error]?.redirect || RoutePath.INDEX}
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {errorMap[error]?.title}
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {errorMap[error]?.content ||
            'Please contact us if this error persists.'}
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
