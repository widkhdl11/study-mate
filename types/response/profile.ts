export type ProfileResponse = { 
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    birth_date: string | null;
    gender: string | null;
    points: number | null;
    created_at: string | null;
    updated_at: string | null;
}