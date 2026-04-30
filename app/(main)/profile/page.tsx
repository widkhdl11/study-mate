import { getMyChatRoomsSSR } from "@/actions/chatAction";
import { getMyProfilesCountSSR, getMyProfileSSR } from "@/actions/profileAction";
import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import ProfileSection from "@/components/profile/ProfileSection";
import TabSection from "@/components/profile/TabSection";
import { Skeleton } from "@/components/skeleton";
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

function TabSectionSkeleton() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-3 bg-muted/50 rounded-lg">
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-md" />
          ))}
        </div>
        <div className="p-6 border rounded-lg space-y-4">
          <Skeleton className="h-7 w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// import { getMyPostsSSR } from "@/actions/postAction";
// import { getMyStudiesSSR } from "@/actions/studyAction";
// import { getMyProfileSSR } from "@/actions/profileAction";
// import { notFound } from "next/navigation";
// import { getMyChatRoomsSSR } from "@/actions/chatAction";
// import UserProfileUI from "./ui";

// export default async function UserProfilePage() {

//   const [profileData, postsData, studiesData, chatRoomsData] = await Promise.all([
//     getMyProfileSSR(),
//     getMyPostsSSR(),
//     getMyStudiesSSR(),
//     getMyChatRoomsSSR(),
//   ]);
//   if (!profileData) { 
//     notFound()
//   }
//   return (
//     <div>
//       <UserProfileUI user={profileData} posts={postsData} studies={studiesData} chatRooms={chatRoomsData} />
//     </div>
//   );
// }
