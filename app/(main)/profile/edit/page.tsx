import { getMyProfileSSR } from "@/actions/userAction";
import { ProfileEditUI } from "./ui"

export default async function ProfileEditPage() {

  const currentUser = await getMyProfileSSR();

  const initialData = {
    username: currentUser.username,
    email: currentUser.email,
    bio: currentUser.bio,
    birthDate: currentUser.birth_date,
    gender: currentUser.gender,
  }

  return <ProfileEditUI initialData={initialData} />
}
