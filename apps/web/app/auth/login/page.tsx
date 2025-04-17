"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RoutePath } from "@/lib/constants";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import { Suspense, useActionState } from "react";
import { login, loginByProvider } from "@/actions/login";
import { LoadingOutlined } from '@ant-design/icons';

function Login() {
  const searchParams = useSearchParams();

  const [formResult, formAction, isPending] = useActionState<
    KitResponse,
    FormData
  >(login, {});
  const [providerFormResult, providerFormAction, isProviderPending] =
    useActionState<KitResponse, FormData>(loginByProvider, {});

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
                value={searchParams.get("callbackUrl") ?? RoutePath.INDEX}
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
                value={searchParams.get("callbackUrl") ?? RoutePath.INDEX}
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
            还没有账号？{" "}
            <Link href={RoutePath.SIGNUP_URL} className="underline">
              注册
            </Link>
          </div>
        </CardContent>
      </Card>
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
