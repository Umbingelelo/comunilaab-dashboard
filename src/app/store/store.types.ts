export interface Store {
    id: number;
    place_id: number;
    location_id: number;
    name: string;
    description: string;
    logo_link: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    time?: string;
    type?: string;
    picture?: string;
    place_name?: string;
    map_store_link?: string;
}