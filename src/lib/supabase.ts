import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

/** Row shape from cv_issues table */
export interface IssueRow {
    id: string;
    title: string;
    description: string;
    category: string;
    severity: string;
    status: string;
    area: string;
    ward?: string;
    municipal_zone?: string;
    constituency?: string;
    lat?: number;
    lng?: number;
    reported_by?: string;
    is_anonymous: boolean;
    image_url?: string;
    upvotes: number;
    upvoted_by: string[];
    created_at: string;
    updated_at: string;
}

/** Row shape from cv_users table */
export interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    voter_id?: string;
    constituency?: string;
    ward?: string;
    avatar_url?: string;
    created_at: string;
}
