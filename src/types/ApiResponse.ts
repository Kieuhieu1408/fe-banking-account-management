export interface ApiResponse<T = unknown> {
    code: number;
    message?: string;
    result?: T;
}