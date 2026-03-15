import { getPostDetailSSR } from "@/actions/postAction";
import { PostEditUI } from "./ui"
import { getMyCreatedStudiesSSR } from "@/actions/studyAction";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PostEditPage({ params }: PageProps) {
  const { id } = await params

  const [post, userStudies] = await Promise.all([
    getPostDetailSSR(Number(id)),
    getMyCreatedStudiesSSR(),
  ]);

  return <PostEditUI initialData={post} studies={userStudies} />
}
