import './globals.css'

export const metadata = {
  title: 'SVG to JSX/TSX Converter',
  description: 'Convert SVG icons to React components easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}