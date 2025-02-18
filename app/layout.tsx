import { Kanit } from 'next/font/google'
import { ScanProvider } from './context/ScanContext'
import './globals.css'

const kanit = Kanit({
    subsets: ['thai'],
    weight: ['300', '400', '500', '600'],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th">
            <body className={kanit.className}>
                <ScanProvider>
                    {children}
                </ScanProvider>
            </body>
        </html>
    )
} 