import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/profileAction";
import UserProfileUI from "./ui";
import { notFound } from "next/navigation";

export default async function UserProfilePage() {

  const [profileData, postsData, studiesData] = await Promise.all([
    getMyProfileSSR(),
    getMyPostsSSR(),
    getMyStudiesSSR(),
  ]);
  if (!profileData) {
    return notFound();
  }

  return (
    <div>
      <UserProfileUI user={profileData} posts={postsData} studies={studiesData} />
    </div>
  );
}
