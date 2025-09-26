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
import Link from 'next/link';
import { RoutePath } from '@/lib/constants';
import { signUp } from '@/actions/login';
import { useActionState, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { KitResponse } from '@repo/types';
import { encryptFrontPassword } from '../utils';

export default function SignUpPage() {
  const [formResult, formAction, isPending] = useActionState<
    KitResponse,
    FormData
  >(async (prevState: KitResponse, req: FormData) => {
    const pwd = req.get('password') as string;
    const encryptedPwd = await encryptFrontPassword(pwd, true);
    req.set('password', encryptedPwd);
    return signUp(prevState, req);
  }, {});
  const [formData, setFormData] = useState<any>({});

  function handleChange(e: React.FormEvent<HTMLInputElement>, name: string) {
    setFormData((prev: any) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).value,
    }));
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>输入邮箱来注册你的账号</CardDescription>
          <CardDescription className="text-red-600">
            {formResult.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form className="grid gap-4" action={formAction}>
              <div className="grid gap-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="请输入邮箱"
                  value={formData.email || formResult.data?.email || ''}
                  onInput={(e: any) => handleChange(e, 'email')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password || formResult.data?.password || ''}
                  onInput={(e: any) => handleChange(e, 'password')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inviteCode">邀请码</Label>
                <Input
                  id="inviteCode"
                  name="inviteCode"
                  type="text"
                  placeholder="请输入邀请码"
                  value={
                    formData.inviteCode || formResult.data?.inviteCode || ''
                  }
                  onInput={(e: any) => handleChange(e, 'inviteCode')}
                  required
                />
              </div>
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoadingOutlined className="animate-spin" />}
                注册
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            已有账号？{' '}
            <Link href={RoutePath.SIGNIN_URL} className="underline">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
