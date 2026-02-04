'use client';

import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className="px-48 mb-4">
      {isUser ? (
        <div className="flex justify-end">
          <div className="max-w-2xl bg-gray-800 text-white px-4 py-3 rounded-lg">
            <p className="text-sm">{message.text}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-100">{message.text}</p>
          <span className="text-xs text-gray-500 mt-1 block">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )}
    </div>
  );
}
