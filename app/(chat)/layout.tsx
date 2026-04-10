import { Suspense } from "react";
import Header from "@/components/header";
import { getMyProfileSSR } from "@/actions/profileAction";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const myProfile = await getMyProfileSSR();

  return (
    <div className="h-screen flex flex-col">
      <Suspense fallback={null}>
        <Header myProfile={myProfile} />
      </Suspense>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}