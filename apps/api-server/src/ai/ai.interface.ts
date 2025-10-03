export interface ChatRequest {
  user_id: string;
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  mcp_command?: string;
  parameters: Record<string, string>;
  matched: boolean;
}

export interface KeywordRequest {
  message: string;
}

export interface KeywordResponse {
  intent: string;
  matched_keywords: string[];
  parameters: Record<string, string>;
  matched: boolean;
  user_guide?: string;
}

export interface IAIService {
  ProcessChat(data: ChatRequest): Promise<ChatResponse>;
  MatchKeyword(data: KeywordRequest): Promise<KeywordResponse>;
}
