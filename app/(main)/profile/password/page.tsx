import { getMyProfileSSR } from "@/actions/profileAction";
import { PasswordChangeForm } from "@/components/profile/password/PasswordChangeForm";
import { ProfileSkeleton } from "@/components/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function PasswordChangePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <PasswordChangeLoader />
    </Suspense>
  );
}

async function PasswordChangeLoader() {
  const currentUser = await getMyProfileSSR();
  if (!currentUser) redirect("/login");
  return <PasswordChangeForm />;
}