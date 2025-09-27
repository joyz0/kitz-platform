import { auth } from '@/lib/auth';
import { ResponseBuilder } from '@repo/types';

// export const GET = auth((req: any) => {
//   if (req.auth) {
//     return Response.json({
//       data: {
//         appKey: process.env.EASEMOB_APPKEY,
//         accessToken: process.env.EASEMOB_ACCESS_TOKEN,
//         username: process.env.EASEMOB_USERNAME,
//       },
//     });
//   }

//   return Response.json({ message: 'Not authenticated' }, { status: 401 });
// }) as any;  // TODO: Fix `auth()` return type

export const GET = (req: any) => {
  const data = {
    appKey: '1115240819153716#jmwy-manage',
    accessToken:
      'YWMtROYAqkXjEfCKaKHaOTd-Lozq_l6IaEOvhVNxqaIbB73NMbDQloQR74gCz7msKLlOAwMAAAGXWVLGXjeeSADF4ehT8ivmzOFyErww-i9tWUL-wbmhLUyyqPrpqVg8oQ',
    username: 'dev-jmwy1888888888888888888',
  };

  return Response.json(ResponseBuilder.success(data, 'Success'));
};
