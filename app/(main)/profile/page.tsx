import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/profileAction";
import UserProfileUI from "./ui";
import { PostsResponse } from "@/types/response/post";
import { StudiesResponse } from "@/types/response/studies";

export default async function UserProfilePage() {

  const [profileData, postsData, studiesData] = await Promise.all([
    getMyProfileSSR(),
    getMyPostsSSR(),
    getMyStudiesSSR(),
  ]);

  return (
    <div>
      <UserProfileUI user={profileData} posts={postsData} studies={studiesData} />
    </div>
  );
}
