import { getMyPostsSSR } from "@/actions/postAction";
import { getMyStudiesSSR } from "@/actions/studyAction";
import { getMyProfileSSR } from "@/actions/profileAction";
import UserProfileUI from "./ui";
import { notFound } from "next/navigation";

export default async function UserProfilePage() {

  return <UserProfileUI />;
}
