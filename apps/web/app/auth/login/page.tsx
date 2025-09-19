'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Label,
} from '@repo/ui';
import { ChatWidgetProps } from '@repo/chat-ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RoutePath } from '@/lib/constants';
import {
  Suspense,
  use,
  useActionState,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { login, loginByProvider } from '@/actions/login';
import { LoadingOutlined } from '@ant-design/icons';
import { encryptFrontPassword } from '../utils';
import { Request } from '@/lib/request';
import dynamic from 'next/dynamic';

const ChatUIWrapper = dynamic(
  () => {
    if (typeof window === 'undefined') {
      return Promise.resolve(() => <div>服务端环境无法加载聊天组件</div>);
    }
    const origin = window.location.origin;
    return Request.get(`${origin}/api/secret/easemob`)
      .then((res) => {
        const config = {
          appKey: res.data.appKey,
          username: res.data.username,
          accessToken: res.data.accessToken,
        };
        return import('@repo/chat-ui').then(
          (mod) => (props: ChatWidgetProps) => (
            <mod.ChatApp config={config} {...props} />
          ),
        );
      })
      .catch((error) => {
        console.error('聊天组件初始化失败:', error);
        return Promise.resolve(() => (
          <div className="text-red-500 p-4">
            <p>聊天组件加载失败: {error.message}</p>
          </div>
        ));
      });
  },
  {
    ssr: false,
    loading: () => <div className="text-center">加载聊天组件...</div>,
  },
);

function Login() {
  const searchParams = useSearchParams();

  const [formResult, formAction, isPending] = useActionState<
    KitResponse,
    FormData
  >(async (prevState: KitResponse, req: FormData) => {
    const pwd = req.get('password') as string;
    const encryptedPwd = await encryptFrontPassword(pwd, true);
    req.set('password', encryptedPwd);
    return login(prevState, req);
  }, {});
  const [providerFormResult, providerFormAction, isProviderPending] =
    useActionState<KitResponse, FormData>(loginByProvider, {});

  // const [config, setConfig] = useState<any>();
  // const initChatUI = async () => {
  //   const { data } = await Request.get(
  //     `${window.location.origin}/api/secret/easemob`,
  //   );
  //   setConfig({
  //     mountId: 'chat-ui-container',
  //     appKey: data.appKey,
  //     username: data.username,
  //     accessToken: data.accessToken,
  //   });
  // };
  // useEffect(() => {
  //   initChatUI();
  // }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>输入邮箱来登录你的账号</CardDescription>
          <CardDescription className="text-red-600">
            {formResult.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form className="grid gap-4" action={formAction}>
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('callbackUrl') ?? RoutePath.DASHBOARD}
              />
              <div className="grid gap-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密码</Label>
                  {/* <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    忘记密码
                  </Link> */}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                  required
                />
              </div>
              <Button
                disabled={isPending || isProviderPending}
                type="submit"
                className="w-full"
              >
                {(isPending || isProviderPending) && (
                  <LoadingOutlined className="animate-spin" />
                )}
                登录
              </Button>
            </form>
            <form key="github" action={providerFormAction}>
              <input type="hidden" name="provider" value="github" />
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('callbackUrl') ?? RoutePath.DASHBOARD}
              />
              <Button
                disabled={isPending || isProviderPending}
                type="submit"
                variant="outline"
                className="w-full"
              >
                <span>使用 Github 登录</span>
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            还没有账号？{' '}
            <Link href={RoutePath.SIGNUP_URL} className="underline">
              注册
            </Link>
          </div>
        </CardContent>
      </Card>
      <Suspense>
        <ChatUIWrapper />
      </Suspense>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
