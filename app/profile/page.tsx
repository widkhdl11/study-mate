import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/userAction";
import UserProfileUI from "./ui";
import { PostsResponse } from "@/types/response/post";
import { StudiesResponse } from "@/types/response/studies";

export default async function UserProfilePage() {

  const [profileData, postsData, studiesData] = await Promise.all([
    getMyProfileSSR(),
    getMyPostsSSR(),
    getMyStudiesSSR(),
  ]);

  const profile = profileData;
  const posts = postsData as unknown as PostsResponse[] || [];
  const studies = studiesData as unknown as StudiesResponse[] || [];

  console.log("posts page: ", posts);
  return (
    <div>
      <UserProfileUI user={profile} posts={posts} studies={studies} />
    </div>
  );
}
