'use client'

import { useState } from 'react'

interface YouTubeVideoProps {
  videoUrl: string
  title?: string
  thumbnail?: string
  className?: string
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YouTubeVideo({ videoUrl, title, thumbnail, className }: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractVideoId(videoUrl)

  if (!videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  const thumbUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const handleClick = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className={`relative aspect-video w-full ${className || ''}`}>
        <iframe
          src={embedUrl}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    )
  }

  return (
    <div className={`relative aspect-video w-full cursor-pointer ${className || ''}`} onClick={handleClick}>
      <img
        src={thumbUrl}
        alt={title || 'Video thumbnail'}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-dark/40 rounded-lg flex items-center justify-center transition-opacity hover:bg-dark/50">
        <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
          <svg className="w-6 h-6 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {title && (
        <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium px-3 py-2 bg-dark/70 rounded text-center">
          {title}
        </div>
      )}
    </div>
  )
}