import { getMyChatRoomsSSR } from "@/actions/chatAction";
import { getMyPostsSSR } from "@/actions/postAction";
import { getMyProfilesCountSSR, getMyProfileSSR } from "@/actions/profileAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import ProfileSection from "@/components/profile/ProfileSection";
import TabSection from "@/components/profile/TabSection";
import { TabSectionSkeleton } from "@/components/skeleton";
import { ProfileResponse } from "@/types/profileType";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function UserProfilePage() {
  const profileData = await getMyProfileSSR();
  if (!profileData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <ProfileSection currentUser={profileData} />
        <Suspense fallback={<TabSectionSkeleton />}>
          <ProfileTabsLoader user={profileData} />
        </Suspense>
      </main>
    </div>
  );
}

async function ProfileTabsLoader({ user }: { user: ProfileResponse }) {
  const [postsData, studiesData, chatRoomsData, profilesCountData] = await Promise.all([
    getMyPostsSSR(),
    getMyStudiesSSR(),
    getMyChatRoomsSSR(),
    getMyProfilesCountSSR(),
  ]);

  return (
    <TabSection
      chatRooms={chatRoomsData}
      myPosts={postsData}
      myStudies={studiesData}
      currentUser={user}
      profilesCountData={profilesCountData}
    />
  );
}
