import { Suspense } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            {children}
            <Footer />
        </>
    )
}
