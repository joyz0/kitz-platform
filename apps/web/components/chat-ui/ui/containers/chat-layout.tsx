import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../store/root-store';

const ChatLayout = observer(() => {
  const { imUser } = useRootStore();

  if (!imUser) {
    return <div>请先登录</div>;
  }

  return <div className="chat-container"></div>;
});

export default ChatLayout;
