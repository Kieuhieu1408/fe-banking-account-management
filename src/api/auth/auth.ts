import type { ApiResponse } from "../../types/ApiResponse";
import axios from 'axios';
import type { AuthResult } from "../../types/auth";
const BASE_URL = import.meta.env.VITE_BASE_URL;



export const login = async (username: string, password: string): Promise<string> => {
    try {
        const response = await axios.post<ApiResponse<AuthResult>>(
            `${BASE_URL}/auth/token`,
            { username, password }
        );

        if (response.data.code === 1000 && response.data.result && response.data.result.access_token) {
            return response.data.result.access_token;
        } else {
            throw new Error("Login failed: Invalid response");
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};