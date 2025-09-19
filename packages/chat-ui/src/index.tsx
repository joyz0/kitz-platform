'use client';

import { ReactNode, useMemo, useState } from 'react';
import { RootStore, RootStoreContext } from './store/root-store';
import ChatWidget from './ui/containers/chat-widget';
import type { ChatWidgetProps } from './ui/containers/chat-widget';

export type { ChatWidgetProps };

export const ChatApp: React.FC<ChatWidgetProps> = (props) => {
  const store = useMemo(() => new RootStore(props.config!), [props.config]);

  return (
    <RootStoreContext value={store}>
      <ChatWidget {...props} />
    </RootStoreContext>
  );
};

type Position = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export const ChatLoadingOverlay: React.FC<{ position?: Position }> = ({
  position = 'bottom-right',
}) => {
  return (
    <div
      className={`fixed ${
        {
          'bottom-right': 'bottom-6 right-6',
          'bottom-left': 'bottom-6 left-6',
          'top-right': 'top-6 right-6',
          'top-left': 'top-6 left-6',
        }[position]
      } z-50`}
    >
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
        {/* <LoadingSpinner size={24} color="text-white" /> */}
      </div>
    </div>
  );
};
