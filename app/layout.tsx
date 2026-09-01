export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        {children}
      </body>
    </html>
  )
}
