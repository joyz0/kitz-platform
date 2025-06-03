import { observer } from 'mobx-react-lite';
import { useMetaStore } from '../../store/root-store';

const ChatLayout = observer(() => {
  const { imConnectStatus } = useMetaStore();

  if (imConnectStatus !== 'ready') {
    return <div>请先登录</div>;
  }

  return <div className="chat-container"></div>;
});

export default ChatLayout;
