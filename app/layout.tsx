export const metadata = {
  title: 'لوحة التحكم',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-black">{children}</body>
    </html>
  )
}
