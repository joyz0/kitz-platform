'use client';

import { useMemo } from 'react';
import { RootStore, RootStoreContext } from './store/root-store';
import ChatLayout from './ui/containers/chat-layout';
import { IMConnectOption } from './core/im-adapter';
import { EasemobClient } from './sdk/easemob/adapter';

export const ChatApp: React.FC<IMConnectOption<EasemobClient>> = (props) => {
  const store = useMemo(() => new RootStore(props), []);

  return (
    <RootStoreContext value={store}>
      <ChatLayout />
    </RootStoreContext>
  );
};
