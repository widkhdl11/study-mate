export type ProfileResponse = {
    id: string | null
    email: string | null
    username: string | null
    avatar_url: string | null
    birth_date: string | null
    gender: string | null
    bio: string | null
    points: number | null
    created_at: string | null
    updated_at: string | null
}


export interface MyProfileCountResponse {
    my_posts_count: number
    my_participated_studies_count: number
    my_participated_chat_rooms_count: number
}