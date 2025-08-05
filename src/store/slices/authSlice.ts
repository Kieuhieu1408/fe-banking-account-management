import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { login as loginAPI } from '../../api/auth/auth';
import type {User, AuthState} from '../../types/User';
import type { JWTPayload } from '../../types/auth';

// Biến toàn cục để lưu role (có thể truy cập từ bất kỳ đâu)
let globalUserRole: string | null = null;
let globalUserId: string | null = null;

// Export functions để truy cập biến toàn cục
export const getGlobalUserRole = (): string | null => globalUserRole;
export const getGlobalUserId = (): string | null => globalUserId;
export const setGlobalUserRole = (role: string | null): void => { globalUserRole = role; };
export const setGlobalUserId = (userId: string | null): void => { globalUserId = userId; };


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
  async ({ username, password }: { username: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const accessToken = await loginAPI(username, password);

      // Lưu token vào cookies
      Cookies.set('authToken', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        expires: 7
      });

      // Giải mã token để lấy thông tin user
      const decodedToken = jwtDecode<JWTPayload>(accessToken);

      // Lấy role từ realm_access.roles (lấy role đầu tiên không phải default)
      const userRole = decodedToken.realm_access?.roles?.find(role => 
        role !== 'default-roles-bank_account' && 
        role !== 'offline_access' && 
        role !== 'uma_authorization'
      ) || 'USER'; // fallback to USER

      // Tạo object User từ token đã giải mã
      const user: User = {
        id: decodedToken.sub,
        role: userRole, // ADMIN, USER
        scope: decodedToken.scope,
        sub: decodedToken.sub,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
        jti: decodedToken.jti,
        iss: decodedToken.iss,
        username: decodedToken.preferred_username,
        fullName: decodedToken.name,
        email: decodedToken.email,
      };

      // Lưu vào localStorage
      localStorage.setItem('userScope', decodedToken.scope);
      localStorage.setItem('userId', decodedToken.sub);

      // Cập nhật biến toàn cục
      setGlobalUserRole(decodedToken.scope);
      setGlobalUserId(decodedToken.sub);

      return {
        token: accessToken,
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

    Cookies.remove('authToken');
    localStorage.removeItem('userScope');
    localStorage.removeItem('userId');

    // Clear biến toàn cục
    setGlobalUserRole(null);
    setGlobalUserId(null);

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
      
      // Clear biến toàn cục
      setGlobalUserRole(null);
      setGlobalUserId(null);
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
      // Khôi phục thông tin auth từ cookies khi app khởi động
      const token = Cookies.get('authToken');

      if (token) {
        try {
          const decodedToken = jwtDecode<JWTPayload>(token);
          
          // Kiểm tra token có hết hạn không
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Token đã hết hạn, xóa cookies
            Cookies.remove('authToken');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            setGlobalUserRole(null);
            setGlobalUserId(null);
            return;
          }

          // Lấy role từ realm_access.roles
          const userRole = decodedToken.realm_access?.roles?.find(role => 
            role !== 'default-roles-bank_account' && 
            role !== 'offline_access' && 
            role !== 'uma_authorization'
          ) || 'USER';

          state.token = token;
          state.user = {
            id: decodedToken.sub,
            role: userRole,
            scope: decodedToken.scope,
            sub: decodedToken.sub,
            exp: decodedToken.exp,
            iat: decodedToken.iat,
            jti: decodedToken.jti,
            iss: decodedToken.iss,
            username: decodedToken.preferred_username,
            fullName: decodedToken.name,
            email: decodedToken.email,
          };
          state.isAuthenticated = true;
          
          // Cập nhật biến toàn cục
          setGlobalUserRole(userRole);
          setGlobalUserId(decodedToken.sub);
        } catch (error) {
          // Token không hợp lệ, xóa cookies
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          Cookies.remove('authToken');
          setGlobalUserRole(null);
          setGlobalUserId(null);
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
