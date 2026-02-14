import PostCreateUI from "./ui";
import { getMyCreatedStudiesSSR } from "@/actions/studyAction";

export default async function PostCreatePage() {
  const userStudies = await getMyCreatedStudiesSSR();
  return <PostCreateUI studies={userStudies} />;
}
