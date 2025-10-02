import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { redirect } from 'next/navigation';
import { signIn, providerMap } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { RoutePath } from '@/lib/constants';

export default async function LoginPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  const { callbackUrl } = await props.searchParams;
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            This demo uses GitHub for authentication.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            action={async (formData) => {
              'use server';
              try {
                const user = await signIn('credentials', formData);
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${RoutePath.ERROR_URL}?error=${error.type}`);
                }
                throw error;
              }
            }}
          >
            <label htmlFor="email">
              Email
              <input
                type="text"
                name="email"
                id="email"
                value="test@admin.com"
                readOnly
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                id="password"
                value="admin@123456"
                readOnly
              />
            </label>
            <input type="submit" value="Sign In" />
          </form>
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                'use server';
                try {
                  await signIn(provider.id, {
                    redirectTo: callbackUrl ?? '/',
                  });
                } catch (error) {
                  // Signin can fail for a number of reasons, such as the user
                  // not existing, or the user not having the correct role.
                  // In some cases, you may want to redirect to a custom error
                  if (error instanceof AuthError) {
                    return redirect(
                      `${RoutePath.ERROR_URL}?error=${error.type}`,
                    );
                  }

                  // Otherwise if a redirects happens Next.js can handle it
                  // so you can just re-thrown the error and let Next.js handle it.
                  // Docs:
                  // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                  throw error;
                }
              }}
            >
              <button type="submit">
                <span>Sign in with {provider.name}</span>
              </button>
            </form>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
// export default function SignInPage() {
//   return (
//     <div className="min-h-screen flex justify-center items-start md:items-center p-8">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             This demo uses GitHub for authentication.
//           </CardDescription>
//         </CardHeader>
//         <CardFooter>
//           <form action={loginByGithub} className="w-full">
//             <Button className="w-full">Sign in with GitHub</Button>
//           </form>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
