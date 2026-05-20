import { apiRequest } from '@/services/api/http-client'

export function sendChatMessage(message, history = []) {
  return apiRequest('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
}

export function sendImageChatMessage({ file, message, history = [] }) {
  const formData = new FormData()

  formData.append('image', file)
  formData.append('message', message)
  formData.append('history', JSON.stringify(history))

  return apiRequest('/api/v1/chat/image', {
    method: 'POST',
    body: formData,
  })
}
