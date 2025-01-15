export type ModuleProgress = {
    user_id: string;
    module_id: string;
    last_page_index: number;
    last_access_time: string;
    completed_at?: string;
};