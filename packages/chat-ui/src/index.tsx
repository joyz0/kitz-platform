'use client';

import { ChatApp } from './app';

interface ChatUIProps {
  mountId: string;
  appKey: string;
  username: string;
  accessToken: string;
}

export function ChatUI(props: ChatUIProps) {
  return (
    <div id={props.mountId} className="w-0 h-0 overflow-visible">
      <ChatApp {...props} />
    </div>
  );
}
