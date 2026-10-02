import { ChatMessage, UserRole } from '../../types';

export interface SendMessagePayload {
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  relatedRequestId?: string;
  imageUrl?: string;
}

export interface IChatService {
  getMessages(userId1: string, userId2: string, requestId?: string): Promise<ChatMessage[]>;
  sendMessage(payload: SendMessagePayload): Promise<ChatMessage>;
  markAsRead(messageIds: string[]): Promise<void>;
  subscribeToChat(
    userId: string,
    callback: (message: ChatMessage) => void
  ): () => void;
}
