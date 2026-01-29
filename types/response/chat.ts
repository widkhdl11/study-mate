export interface ChatMessage {
    id: string | null;
    chat_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profile: {
        username: string;
        avatar_url: string | null;
    };
}


export interface ChatParticipant {
    id: string;
    chat_id: string;
    user_id: string;
    created_at: string;
    last_read_at: string;

    profile: {
        username: string;
        avatar_url: string | null;
    };
}

export interface ChatRoom {
    id: string;
    study_id: string;
    is_group: boolean;
    name: string;
}