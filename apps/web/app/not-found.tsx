import { RoutePath } from '@/lib/constants';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Link
        href={RoutePath.INDEX}
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Not Found
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          <p>没有找到资源</p>
        </div>
      </Link>
    </div>
  );
}
