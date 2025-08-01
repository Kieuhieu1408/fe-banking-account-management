import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { login as loginAPI } from '../../api/auth/auth';
import type {User, AuthState} from '../../types/User';

interface JWTPayload {
  scope: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  iss: string;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get('authToken') || null,
  isAuthenticated: !!Cookies.get('authToken'),
  loading: false,
  error: null,
};

// Async thunk cho login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const tokenResponse = await loginAPI(email, password);

      // Lưu token vào cookies
      Cookies.set('authToken', tokenResponse.token, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        expires: 7
      });

      // Giải mã token để lấy thông tin user
      const decodedToken = jwtDecode<JWTPayload>(tokenResponse.token);

      // Tạo object User từ token đã giải mã
      const user: User = {
        id: decodedToken.sub,
        scope: decodedToken.scope,
        sub: decodedToken.sub,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
        jti: decodedToken.jti,
        iss: decodedToken.iss,
      };

      // Lưu vào localStorage
      localStorage.setItem('userScope', decodedToken.scope);
      localStorage.setItem('userId', decodedToken.sub);

      return {
        token: tokenResponse.token,
        user: user,
      };
    } catch (error) {
      return rejectWithValue('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
  }
);

// Async thunk cho logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    // Xóa cookies và localStorage
    Cookies.remove('authToken');
    localStorage.removeItem('userScope');
    localStorage.removeItem('userId');

    dispatch(setLoading(false));
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Xóa cookies và localStorage
      Cookies.remove('authToken');
      localStorage.removeItem('userScope');
      localStorage.removeItem('userId');
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    initializeAuth(state) {
      // Khôi phục thông tin auth từ cookies và localStorage khi app khởi động
      const token = Cookies.get('authToken');
      const userId = localStorage.getItem('userId');
      const userScope = localStorage.getItem('userScope');

      if (token && userId && userScope) {
        try {
          const decodedToken = jwtDecode<JWTPayload>(token);

          state.token = token;
          state.user = {
            id: userId,
            scope: userScope,
            sub: decodedToken.sub,
            exp: decodedToken.exp,
            iat: decodedToken.iat,
            jti: decodedToken.jti,
            iss: decodedToken.iss,
          };
          state.isAuthenticated = true;
        } catch (error) {
          // Token không hợp lệ, xóa dữ liệu
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          Cookies.remove('authToken');
          localStorage.removeItem('userScope');
          localStorage.removeItem('userId');
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { setUser, logout, setLoading, setError, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
