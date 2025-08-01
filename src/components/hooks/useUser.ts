import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchUserProfile,
  fetchBankAccounts,
  updateUserProfile,
  setProfile,
  setBankAccounts,
  setSelectedAccount,
  addBankAccount,
  updateBankAccount,
  removeBankAccount,
  setError,
  clearError,
  clearUserData,
} from '../../store/slices/userSlice';
import type { UserProfile, BankAccount } from '../../types/User';

/**
 * Custom hook để quản lý User data và Bank Accounts
 * Theo cấu trúc docs: src/components/hooks/useUser.ts
 */
export const useUser = () => {
  const dispatch = useAppDispatch();
  const {
    profile,
    bankAccounts,
    selectedAccount,
    loading,
    error,
    profileLoading,
    accountsLoading,
  } = useAppSelector(state => state.user);

  // Fetch user profile
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      await dispatch(fetchUserProfile(userId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Fetch bank accounts
  const loadBankAccounts = useCallback(async (userId: string) => {
    try {
      await dispatch(fetchBankAccounts(userId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Set user profile manually
  const setUserProfile = useCallback((profileData: UserProfile | null) => {
    dispatch(setProfile(profileData));
  }, [dispatch]);

  // Set bank accounts manually
  const setUserBankAccounts = useCallback((accounts: BankAccount[]) => {
    dispatch(setBankAccounts(accounts));
  }, [dispatch]);

  // Select bank account
  const selectAccount = useCallback((account: BankAccount | null) => {
    dispatch(setSelectedAccount(account));
  }, [dispatch]);

  // Add new bank account
  const addNewBankAccount = useCallback((account: BankAccount) => {
    dispatch(addBankAccount(account));
  }, [dispatch]);

  // Update existing bank account
  const updateExistingBankAccount = useCallback((account: BankAccount) => {
    dispatch(updateBankAccount(account));
  }, [dispatch]);

  // Remove bank account
  const removeBankAccountById = useCallback((accountId: string) => {
    dispatch(removeBankAccount(accountId));
  }, [dispatch]);

  // Error handling
  const setUserError = useCallback((errorMessage: string) => {
    dispatch(setError(errorMessage));
  }, [dispatch]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear all user data (for logout)
  const clearAllUserData = useCallback(() => {
    dispatch(clearUserData());
  }, [dispatch]);

  // Utility functions
  const getTotalBalance = useCallback(() => {
    return bankAccounts.reduce((total, account) => total + account.balance, 0);
  }, [bankAccounts]);

  const getActiveAccounts = useCallback(() => {
    return bankAccounts.filter(account => account.isActive);
  }, [bankAccounts]);

  const getAccountByType = useCallback((type: 'SAVINGS' | 'CHECKING' | 'CREDIT') => {
    return bankAccounts.filter(account => account.accountType === type);
  }, [bankAccounts]);

  const formatBalance = useCallback((balance: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(balance);
  }, []);

  return {
    // State
    profile,
    bankAccounts,
    selectedAccount,
    loading,
    error,
    profileLoading,
    accountsLoading,

    // Actions
    loadUserProfile,
    loadBankAccounts,
    updateProfile,
    setUserProfile,
    setUserBankAccounts,
    selectAccount,
    addNewBankAccount,
    updateExistingBankAccount,
    removeBankAccountById,
    setUserError,
    clearUserError,
    clearAllUserData,

    // Utilities
    getTotalBalance,
    getActiveAccounts,
    getAccountByType,
    formatBalance,
  };
};
