import UserStudyDetailUI from "./ui";

export default async function StudyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <UserStudyDetailUI params={{ id }} />;
}
