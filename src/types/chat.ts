export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  messages: Pick<Message, "role" | "content">[];
}

export interface ChatResponse {
  message: string;
}

export interface ChatError {
  error: string;
}
