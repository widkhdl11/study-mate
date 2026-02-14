import { redirect } from "next/navigation";
import { getMyProfileSSR } from "@/actions/profileAction";
import { ProfileEditUI } from "./ui"

export default async function ProfileEditPage() {
  const currentUser = await getMyProfileSSR();
  if (!currentUser) {
    redirect("/login");
  }
  return <ProfileEditUI initialData={currentUser} />
}
