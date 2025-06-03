import { RootStoreProvider } from './store/root-store';
import ChatLayout from './ui/containers/chat-layout';

const ChatApp: React.FC = () => {
  return (
    <RootStoreProvider>
      <ChatLayout />
    </RootStoreProvider>
  );
};

export default ChatApp;
