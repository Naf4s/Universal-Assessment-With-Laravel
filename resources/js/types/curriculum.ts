export interface CurriculumTemplate {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    aspects_count?: number;
    created_at: string;
    updated_at: string;
}

export interface CurriculumAspect {
    id: number;
    name: string;
    parent_id: number | null;
    input_type: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAspectRequest {
    name: string;
    parent_id: number | null;
    input_type: string;
}

export interface UpdateAspectRequest {
    name: string;
    parent_id: number | null;
    input_type: string;
} 