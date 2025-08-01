import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, BankAccount } from '../../types/User';

// Interface cho User State
interface UserState {
  profile: UserProfile | null;
  bankAccounts: BankAccount[];
  selectedAccount: BankAccount | null;
  loading: boolean;
  error: string | null;
  profileLoading: boolean;
  accountsLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  bankAccounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
  profileLoading: false,
  accountsLoading: false,
};

// Async thunk để lấy user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await getUserProfileAPI(userId);

      // Mock data cho development
      const mockProfile: UserProfile = {
        id: userId,
        email: 'user@example.com',
        username: 'user123',
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        scope: 'ROLE_USER',
        sub: userId,
        exp: Date.now() / 1000 + 3600,
        iat: Date.now() / 1000,
        jti: 'mock-jti',
        iss: 'devteria.com',
        isActive: true,
        address: '123 Đường ABC, Quận 1, TP.HCM',
        dateOfBirth: '1990-01-01',
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockProfile;
    } catch (error) {
      return rejectWithValue('Không thể tải thông tin người dùng');
    }
  }
);

// Async thunk để lấy danh sách bank accounts
export const fetchBankAccounts = createAsyncThunk(
  'user/fetchBankAccounts',
  async (_userId: string, { rejectWithValue }) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await getBankAccountsAPI(userId);

      // Mock data cho development
      const mockAccounts: BankAccount[] = [
        {
          id: '1',
          accountNumber: '1234567890',
          accountType: 'SAVINGS',
          balance: 5000000,
          currency: 'VND',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          accountNumber: '0987654321',
          accountType: 'CHECKING',
          balance: 2000000,
          currency: 'VND',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      return mockAccounts;
    } catch (error) {
      return rejectWithValue('Không thể tải danh sách tài khoản');
    }
  }
);

// Async thunk để cập nhật user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await updateUserProfileAPI(profileData);

      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));

      return profileData;
    } catch (error) {
      return rejectWithValue('Không thể cập nhật thông tin người dùng');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
    setBankAccounts(state, action: PayloadAction<BankAccount[]>) {
      state.bankAccounts = action.payload;
    },
    setSelectedAccount(state, action: PayloadAction<BankAccount | null>) {
      state.selectedAccount = action.payload;
    },
    addBankAccount(state, action: PayloadAction<BankAccount>) {
      state.bankAccounts.push(action.payload);
    },
    updateBankAccount(state, action: PayloadAction<BankAccount>) {
      const index = state.bankAccounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.bankAccounts[index] = action.payload;
      }
    },
    removeBankAccount(state, action: PayloadAction<string>) {
      state.bankAccounts = state.bankAccounts.filter(account => account.id !== action.payload);
      if (state.selectedAccount?.id === action.payload) {
        state.selectedAccount = null;
      }
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
    clearUserData(state) {
      state.profile = null;
      state.bankAccounts = [];
      state.selectedAccount = null;
      state.error = null;
      state.loading = false;
      state.profileLoading = false;
      state.accountsLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload as string;
      })
      // Fetch bank accounts cases
      .addCase(fetchBankAccounts.pending, (state) => {
        state.accountsLoading = true;
        state.error = null;
      })
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.accountsLoading = false;
        state.bankAccounts = action.payload;
        // Tự động chọn account đầu tiên nếu chưa có account nào được chọn
        if (!state.selectedAccount && action.payload.length > 0) {
          state.selectedAccount = action.payload[0];
        }
        state.error = null;
      })
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.accountsLoading = false;
        state.error = action.payload as string;
      })
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProfile,
  setBankAccounts,
  setSelectedAccount,
  addBankAccount,
  updateBankAccount,
  removeBankAccount,
  setLoading,
  setError,
  clearError,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
