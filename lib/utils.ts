import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionId(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 crypto 모듈 사용
    const crypto = require('crypto')
    return `session_${crypto.randomBytes(16).toString('hex')}`
  }
  // 클라이언트 사이드에서는 crypto API 사용
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  return `session_${hex}`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}