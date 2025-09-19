// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';
import { join } from 'path';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    join(__dirname, '../../packages/chat-ui/src/**/*.{js,jsx,ts,tsx}'),
  ],
  presets: [sharedConfig],
};

export default config;
