'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/utils/utils'

interface TimeAgoProps {
  date: string
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setText(formatDate(date))
    update()
    const interval = setInterval(update, 60 * 1000)
    return () => clearInterval(interval)
  }, [date])

  if (text === null) {
    return <span className={className}>...</span>
  }
  return <span className={className}>{text}</span>
}