import PostDetailUI from "./ui";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PostDetailUI id={Number(resolvedParams.id)} />;
}
