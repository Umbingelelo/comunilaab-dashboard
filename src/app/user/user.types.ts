export interface User {
    id?: string;
    email: string;
    password?: string;
    is_active?: boolean;
    confirmPassword?: string;
    created_at?: string;
    updated_at?: string;
}
