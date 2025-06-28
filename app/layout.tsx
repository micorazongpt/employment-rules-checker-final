import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 기반 취업규칙 검토 시스템',
  description: '최신 ChatGPT 기술로 정확하고 빠른 법적 분석을 제공합니다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
