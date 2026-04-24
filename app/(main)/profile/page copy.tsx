import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/profileAction";
import { notFound } from "next/navigation";
import { getMyChatRoomsSSR } from "@/actions/chatAction";
import UserProfileUI from "./ui";

export default async function UserProfilePage() {

  const [profileData, postsData, studiesData, chatRoomsData] = await Promise.all([
    getMyProfileSSR(),
    getMyPostsSSR(),
    getMyStudiesSSR(),
    getMyChatRoomsSSR(),
  ]);
  if (!profileData) { 
    notFound()
  }
  return (
    <div>
      <UserProfileUI user={profileData} posts={postsData} studies={studiesData} chatRooms={chatRoomsData} />
    </div>
  );
}
