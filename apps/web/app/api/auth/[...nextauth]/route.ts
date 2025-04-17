// https://authjs.dev/guides/configuring-github#creating-the-server-config
// Since this is a catch-all dynamic route, it will respond to all the relevant Auth.js API routes so that your application can interact with the chosen OAuth provider using the OAuth 2 protocol.
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
