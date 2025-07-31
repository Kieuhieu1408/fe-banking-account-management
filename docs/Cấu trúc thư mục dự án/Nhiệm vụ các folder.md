# Cấu trúc dự án React Banking Account Management

## Cấu trúc thư mục chi tiết

```
fe-banking-account-management/
├── public/                     # Các tập tính (favicon, index.html, manifest.json)
├── src/                        # Mã nguồn chính
│   ├── assets/                 # Ảnh, font, icons, CSS, SCSS...
│   ├── components/             # Các component dùng chung
│   │   ├── ui/                 # Các component UI chung (Button, Modal, Input)
│   │   ├── layout/             # Các layout như Navbar, Sidebar, Footer
│   │   ├── hooks/              # Custom hooks (useAuth, useTheme...)
│   │   └── utils/              # Hàm tiện ích (formatDate, debounce...)
│   ├── pages/                  # Các trang (Home, About, Dashboard...)
│   │   ├── Home/               # Mỗi page có thư mục riêng
│   │   ├── About/
│   │   └── Dashboard/
│   ├── store/                  # Quản lý state (Redux, Zustand...)
│   │   ├── slices/             # Redux slices (authSlice, userSlice)
│   │   └── index.tsx            # Combine các reducers
│   ├── routes/                 # Cấu hình Router
│   │   ├── privateRoutes.ts    # Route yêu cầu đăng nhập
│   │   ├── publicRoutes.ts     # Route không yêu cầu đăng nhập
│   │   └── index.tsx           # App Router chính
│   ├── api/                    # 🆕 API calls và endpoints
│   │   ├── endpoints/          # Định nghĩa các API endpoints
│   │   │   ├── auth.ts         # API endpoints cho authentication
│   │   │   ├── user.ts         # API endpoints cho user
│   │   │   ├── account.ts      # API endpoints cho bank account
│   │   │   └── transaction.ts  # API endpoints cho transactions
│   │   ├── client.ts           # Axios instance và interceptors
│   │   └── index.tsx            # Export tất cả API functions
│   ├── services/               # Business logic và data processing
│   │   ├── authService.ts      # Logic xử lý authentication
│   │   ├── userService.ts      # Logic xử lý user data
│   │   └── accountService.ts   # Logic xử lý account data
│   ├── config/                 # Cấu hình chung (env, theme...)
│   │   ├── env.ts              # Load biến môi trường
│   │   └── theme.ts            # Dark/Light Theme config
│   ├── types/                  # Chứa TypeScript types
│   │   ├── user.ts             # Định nghĩa kiểu dữ liệu User
│   │   └── auth.ts             # Định nghĩa kiểu dữ liệu Auth
│   ├── App.tsx                 # Component gốc của ứng dụng
│   └── main.tsx                # Entry point của ứng dụng
├── .env                        # Biến môi trường
├── tsconfig.json               # Cấu hình TypeScript
├── tailwind.config.js          # Cấu hình Tailwind CSS
├── package.json                # Danh sách dependencies
├── vite.config.ts              # Cấu hình Vite
└── README.md                   # Tài liệu dự án
```

## Mô tả chức năng từng thư mục

### 📁 `src/assets/`
- Chứa các tài nguyên tĩnh như hình ảnh, font, icons, CSS, SCSS
- Ví dụ: logo.png, icons.svg, main.css

### 📁 `src/components/`
- **ui/**: Các component UI tái sử dụng (Button, Modal, Input, Card...)
- **layout/**: Các component layout (Navbar, Sidebar, Footer, Header...)

### 📁 `src/hooks/`
- Custom hooks để tái sử dụng logic
- Ví dụ: useAuth, useTheme, useLocalStorage, useDebounce

### 📁 `src/utils/`
- Các hàm tiện ích, helper functions
- Ví dụ: formatDate, formatCurrency, debounce, throttle

### 📁 `src/pages/`
- Mỗi trang có thư mục riêng chứa component và các file liên quan
- **Home/**: Trang chủ
- **About/**: Trang giới thiệu  
- **Dashboard/**: Trang quản lý tài khoản ngân hàng

### 📁 `src/store/`
- Quản lý state toàn cục (Redux Toolkit, Zustand...)
- **slices/**: Chứa các slice cho từng feature (auth, user, account...)
- **index.tsx**: Kết hợp các reducers

### 📁 `src/routes/`
- Cấu hình routing cho ứng dụng
- **privateRoutes.ts**: Routes yêu cầu đăng nhập
- **publicRoutes.ts**: Routes công khai
- **index.tsx**: App Router chính

### 📁 `src/api/` 🆕
- **endpoints/**: Chứa các hàm gọi API thuần túy
  - **auth.ts**: API calls cho login, register, logout
  - **user.ts**: API calls cho user CRUD operations
  - **account.ts**: API calls cho bank account management
  - **transaction.ts**: API calls cho transaction history
- **client.ts**: Cấu hình Axios instance, interceptors, error handling
- **index.tsx**: Export tất cả API functions để dễ import

### 📁 `src/services/`
- **Business logic layer** - Xử lý data trước khi gửi lên UI
- **authService.ts**: Logic xử lý authentication (sử dụng api/auth)
- **userService.ts**: Logic xử lý và validate user data
- **accountService.ts**: Logic xử lý tài khoản ngân hàng và transactions

### 📁 `src/config/`
- Cấu hình chung cho ứng dụng
- **env.ts**: Load biến môi trường
- **theme.ts**: Cấu hình Dark/Light theme

### 📁 `src/types/`
- Định nghĩa TypeScript types và interfaces
- **user.ts**: Types cho User model
- **auth.ts**: Types cho Authentication
- **account.ts**: Types cho Bank Account

## Sự khác biệt giữa API và Services

### 🔌 **API Layer** (`src/api/`)
mkdir -p src/assets src/components/ui src/components/layout src/hooks src/utils src/pages/Home src/pages/About src/pages/Dashboard src/store/slices src/routes src/services src/config src/types
// api/endpoints/auth.ts
export const loginAPI = (credentials: LoginCredentials) => {
  return axiosClient.post('/auth/login', credentials);
};

export const getUserProfileAPI = (userId: string) => {
  return axiosClient.get(`/users/${userId}`);
};
```

### 🔧 **Service Layer** (`src/services/`)
```typescript
// services/authService.ts
import { loginAPI, getUserProfileAPI } from '../api/endpoints/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await loginAPI(credentials);
      // Business logic: save token, redirect, etc.
      localStorage.setItem('token', response.data.token);
      return { success: true, user: response.data.user };
    } catch (error) {
      // Error handling logic
      return { success: false, error: error.message };
    }
  }
};
```



