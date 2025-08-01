import type { Token } from "../../types/Token.ts";

export const login = async (_username: string, _password: string): Promise<Token> => {
    // Giả lập API call với delay để mô phỏng network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trả về đối tượng Token giả lập
    return {
        token: "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkZXZ0ZXJpYS5jb20iLCJzdWIiOiJkMDUzOGQxZS05YTQ5LTQ5MGUtODM0ZC1mMDdiODA3YTQ5YWQiLCJleHAiOjE3NTQwMzQwODUsImlhdCI6MTc1NDAzMDQ4NSwianRpIjoiOGZmZDhmMDUtMGMxNS00Y2U2LWFkNjItMjAyMDY5MjUxOTYyIiwic2NvcGUiOiJST0xFX0FETUlOIn0.wfOmz3fnMMfaX9SPEps5nPhxDDg9J8qmD5LAmjiN8X53UWuh9kvB9Au0Nka6t-cG_XK074FtrHdNGjrabc7lAA",
        expiryTime: null
    };
};