import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/profileAction";
import UserProfileUI from "./ui";
import { notFound } from "next/navigation";
import { getMyChatRoomsSSR } from "@/actions/chatAction";

export default async function UserProfilePage() {

  const [profileData, postsData, studiesData, chatRoomsData] = await Promise.all([
    getMyProfileSSR(),
    getMyPostsSSR(),
    getMyStudiesSSR(),
    getMyChatRoomsSSR(),
  ]);
  return (
    <div>
      <UserProfileUI user={profileData} posts={postsData} studies={studiesData} chatRooms={chatRoomsData} />
    </div>
  );
}
