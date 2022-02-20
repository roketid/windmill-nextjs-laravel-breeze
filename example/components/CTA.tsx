import React from 'react'

interface ICTA {
  message: string
  url?: string
  icon?: any
  text?: string
}

function CTA({url, icon, message, text}: ICTA) {
  const Icon = icon
  return (
    <a
      className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
      href={url}
    >
      <div className="flex items-center">
        {icon
          ? <span className="w-5 h-5 mr-2"><Icon /></span>
          : null
        }
        <span>{message}</span>
      </div>
      {
        url
        ? <span>
            {text || `View more`} <span dangerouslySetInnerHTML={{ __html: '&RightArrow;' }}></span>
          </span>
        : null
      }
    </a>
  )
}

export default CTA
