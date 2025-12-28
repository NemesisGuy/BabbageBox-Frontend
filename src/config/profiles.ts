export interface ChatProfile {
  id: string
  name: string
  icon: string
  description: string
  systemPrompt?: string
  params?: Record<string, unknown>
}

export const CHAT_PROFILES: ChatProfile[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: 'fa-comments',
    description: 'Standard conversational assistant',
    systemPrompt: 'You are a helpful AI assistant called BabbageBox.',
  },
  {
    id: 'code',
    name: 'Code',
    icon: 'fa-code',
    description: 'Specialized for programming tasks',
    systemPrompt:
      'You are an expert software engineer. Focus on clean, efficient, and well-documented code.',
    params: {
      temperature: 0.2, // Lower temp for code
    },
  },
  {
    id: 'anonymous',
    name: 'Anonymous',
    icon: 'fa-user-secret',
    description: 'Private session without memory',
    systemPrompt:
      'You are a private assistant. Do not reference past conversations.',
    params: {
      include_memory: false, // Custom param to handle in backend logic later if needed
    },
  },
]
