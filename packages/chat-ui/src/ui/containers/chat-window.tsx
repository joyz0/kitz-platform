import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../store/root-store';

interface ChatWindowProps {
  onClose(): void;
}

const ChatWindow = observer((props: ChatWindowProps) => {
  const { imUser } = useRootStore();

  if (!imUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-white">
        <div className="text-red-500 font-medium">配置加载失败</div>
        <p className="text-gray-500 text-sm mt-2">无法连接聊天服务</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
        <div className="font-medium flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-2" />
          在线客服
        </div>
        <button
          onClick={props.onClose}
          className="text-white hover:text-blue-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
        <div className="flex items-start mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
          <div className="bg-white px-4 py-2 rounded-lg max-w-xs shadow-sm">
            <p className="text-gray-700">您好！请问有什么可以帮您？</p>
            <p className="text-gray-500 text-xs mt-1">刚刚</p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <div className="bg-blue-100 px-4 py-2 rounded-lg max-w-xs shadow-sm">
            <p className="text-gray-700">我想了解一下你们的服务定价</p>
            <p className="text-gray-500 text-xs mt-1 text-right">刚刚</p>
          </div>
        </div>
      </div>

      {/* 消息输入框 */}
      <div className="p-3 border-t">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatWindow;
