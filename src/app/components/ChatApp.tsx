'use client';

import { useState, useCallback } from 'react';
import { Conversation, Message } from '../types/chat';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

// Dummy responses from AI
const dummyResponses = [
  "That's an interesting question! Let me think about that for a moment.",
  "I'd be happy to help you with that. Here's what I think about it...",
  "Great question! This is a complex topic that requires careful consideration.",
  "I appreciate your curiosity. Let me provide you with some insights.",
  "That's something many people wonder about. Here's my perspective...",
  "Absolutely! This is a fascinating area to explore.",
  "I see what you're asking. The answer involves several key points.",
];

export default function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const generateTitle = (firstMessage: string) => {
    const maxLength = 30;
    return firstMessage.substring(0, maxLength) + (firstMessage.length > maxLength ? '...' : '');
  };

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeConversationId) {
        // If no active conversation, create one
        const newConversation: Conversation = {
          id: generateId(),
          title: generateTitle(text),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);

        // Add user message and simulate response
        const userMessage: Message = {
          id: generateId(),
          text,
          sender: 'user',
          timestamp: new Date(),
        };

        const updatedConversation = {
          ...newConversation,
          messages: [userMessage],
          title: generateTitle(text),
        };
        setConversations((prev) =>
          prev.map((c) => (c.id === newConversation.id ? updatedConversation : c))
        );

        simulateAssistantResponse(
          newConversation.id,
          [userMessage],
          updatedConversation.messages
        );
      } else {
        // Add to existing conversation
        const userMessage: Message = {
          id: generateId(),
          text,
          sender: 'user',
          timestamp: new Date(),
        };

        const isFirstMessage = (activeConversation?.messages.length || 0) === 0;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversationId) {
              return {
                ...c,
                messages: [...c.messages, userMessage],
                title: isFirstMessage ? generateTitle(text) : c.title,
                updatedAt: new Date(),
              };
            }
            return c;
          })
        );

        const updatedMessages = [...(activeConversation?.messages || []), userMessage];
        simulateAssistantResponse(
          activeConversationId,
          [userMessage],
          updatedMessages
        );
      }
    },
    [activeConversationId, activeConversation]
  );

  const simulateAssistantResponse = async (
    conversationId: string,
    newMessages: Message[],
    allMessages: Message[]
  ) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const randomResponse =
      dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

    const assistantMessage: Message = {
      id: generateId(),
      text: randomResponse,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...allMessages, assistantMessage],
            updatedAt: new Date(),
          };
        }
        return c;
      })
    );

    setIsLoading(false);
  };

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-900 border-b border-gray-700 p-4 shadow-sm">
              <h1 className="text-xl font-semibold text-white">
                {activeConversation.title}
              </h1>
              <p className="text-sm text-gray-400">
                {activeConversation.messages.length} messages
              </p>
            </div>

            {/* Chat Window */}
            <ChatWindow messages={activeConversation.messages} />

            {/* Chat Input */}
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to Chat
              </h1>
              <p className="text-gray-400 mb-8">
                Start a new conversation to begin chatting
              </p>
              <button
                onClick={handleNewConversation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                + New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
