import { forwardRef } from 'react';

interface ChatOverlayProps {
  onClick(): void;
  loading: boolean;
  isAnimating: boolean;
  isOpen: boolean;
}

const ChatOverlay = forwardRef<HTMLDivElement, ChatOverlayProps>(
  (props, ref) => {
    const { onClick, loading, isAnimating, isOpen } = props;
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center 
          shadow-lg cursor-pointer transition-all duration-300
          ${loading ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}
          ${isAnimating ? 'animate-pulse' : ''}
          transform ${isOpen ? 'rotate-[360deg]' : 'rotate-0'}
        `}
      >
        {loading ? (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 animate-spin">
              <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div
            className={`text-white transition-all ${isOpen ? 'scale-125' : 'scale-100'}`}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}

        {/* 消息提示动画 */}
        {!isOpen && !loading && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default ChatOverlay;
