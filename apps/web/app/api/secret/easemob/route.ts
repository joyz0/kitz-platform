import { auth } from '@/lib/auth';

export const GET = auth((req: any) => {
  if (req.auth) {
    return Response.json({
      data: {
        appKey: process.env.EASEMOB_APPKEY,
        accessToken: process.env.EASEMOB_ACCESS_TOKEN,
        username: process.env.EASEMOB_USERNAME,
      },
    });
  }

  return Response.json({ message: 'Not authenticated' }, { status: 401 });
}) as any; // TODO: Fix `auth()` return type
