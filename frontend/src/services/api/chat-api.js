import { apiRequest } from '@/services/api/http-client'

export function sendChatMessage(message, history = []) {
  return apiRequest('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
}
