import { getMyProfileSSR } from "@/actions/profileAction";
import { ProfileEditForm } from "@/components/profile/edit/ProfileEditForm";
import { ProfileSkeleton } from "@/components/skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function ProfileEditPage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileEditLoader />
    </Suspense>
  );
}

async function ProfileEditLoader() {
  const currentUser = await getMyProfileSSR();
  if (!currentUser) redirect("/login");
  return <ProfileEditForm useData={currentUser} />;
}