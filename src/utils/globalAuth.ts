import { getGlobalUserRole, getGlobalUserId } from '../store/slices/authSlice';

// Utility class để quản lý role toàn cục
export class GlobalAuth {
  // Lấy role hiện tại
  static getUserRole(): string | null {
    return getGlobalUserRole();
  }

  // Lấy user ID hiện tại
  static getUserId(): string | null {
    return getGlobalUserId();
  }

  // Kiểm tra có role cụ thể không
  static hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  // Kiểm tra có một trong nhiều role không
  static hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Kiểm tra là admin
  static isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Kiểm tra là user
  static isUser(): boolean {
    return this.hasRole('USER');
  }

  // Kiểm tra đã đăng nhập chưa
  static isAuthenticated(): boolean {
    return this.getUserRole() !== null;
  }
}

// Export các function riêng lẻ để dễ sử dụng
export const getUserRole = (): string | null => GlobalAuth.getUserRole();
export const getUserId = (): string | null => GlobalAuth.getUserId();
export const hasRole = (role: string): boolean => GlobalAuth.hasRole(role);
export const hasAnyRole = (roles: string[]): boolean => GlobalAuth.hasAnyRole(roles);
export const isAdmin = (): boolean => GlobalAuth.isAdmin();
export const isUser = (): boolean => GlobalAuth.isUser();
export const isAuthenticated = (): boolean => GlobalAuth.isAuthenticated();
