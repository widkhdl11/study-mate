import { getMyProfileSSR } from "@/actions/profileAction";
import { ProfileEditUI } from "./ui"

export default async function ProfileEditPage() {

  const currentUser = await getMyProfileSSR();


  return <ProfileEditUI initialData={currentUser} />
}
