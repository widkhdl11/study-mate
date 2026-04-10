import { Suspense } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getMyProfileSSR } from '@/actions/profileAction';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const myProfile = await getMyProfileSSR();

    return (
        <>
            <Suspense fallback={null}>
                <Header myProfile={myProfile} />
            </Suspense>
            {children}
            <Footer />
        </>
    )
}
