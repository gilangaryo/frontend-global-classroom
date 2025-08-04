// utils/api.ts - Fixed version
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
export interface ApiResponse<T = unknown> {
    status: string;
    message: string;
    data: T;
}

export interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export interface Stats {
    revenue: number;
    users: number;
    courses: number;
    lessons: number;
    units?: number;
    subunits?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface Purchase {
    id: string;
    userId: string;
    itemId: string;
    itemType: string;
    price: number;
    createdAt: string;
}

export interface Course {
    id: string;
    title: string;
    price: number;
}

export interface RevenueData {
    totalRevenue: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    chartData: MonthlyRevenue[];
    topProducts: TopProduct[];
}

export interface MonthlyRevenue {
    month: string;
    year: number;
    revenue: number;
    count: number;
}

export interface TopProduct {
    productId: string;
    title: string;
    type: string;
    totalRevenue: number;
    totalSales: number;
    unitPrice: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Custom Error Class
export class ApiError extends Error {
    public status: number;
    public response: Response | null;

    constructor(message: string, status: number, response: Response | null = null) {
        super(message);
        this.status = status;
        this.response = response;
        this.name = 'ApiError';
    }
}

// API Client
export const apiClient = {
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const token = localStorage.getItem('token');

        const config: RequestOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            // Handle authentication errors
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new ApiError('Unauthorized', 401, response);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || `HTTP error! status: ${response.status}`,
                    response.status,
                    response
                );
            }

            const data: ApiResponse<T> = await response.json();
            return (data.data || data) as T;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            const err = error as Error;
            throw new ApiError(err.message, 0, null);
        }
    },

    get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    },

    put<T>(endpoint: string, data: unknown, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
};

// Dashboard API functions
export const dashboardApi = {
    getStats: (): Promise<Stats> => apiClient.get<Stats>('/api/dashboard/stats'),
    getUsers: (): Promise<User[]> => apiClient.get<User[]>('/api/dashboard/users'),
    getPayments: (): Promise<Payment[]> => apiClient.get<Payment[]>('/api/dashboard/payments'),
    getOrders: (): Promise<Purchase[]> => apiClient.get<Purchase[]>('/api/dashboard/orders'),
    getProducts: (): Promise<Course[]> => apiClient.get<Course[]>('/api/dashboard/products'),

    // Revenue endpoints
    getRevenueOverview: (): Promise<RevenueData> => apiClient.get<RevenueData>('/api/dashboard/revenue/overview'),
    getMonthlyRevenue: (): Promise<MonthlyRevenue[]> => apiClient.get<MonthlyRevenue[]>('/api/dashboard/revenue/monthly'),
    getTopProducts: (): Promise<TopProduct[]> => apiClient.get<TopProduct[]>('/api/dashboard/revenue/top-products'),

    // Fetch all dashboard data at once
    getAllData: async () => {
        const [stats, users, payments, orders, products, revenue] = await Promise.all([
            dashboardApi.getStats(),
            dashboardApi.getUsers(),
            dashboardApi.getPayments(),
            dashboardApi.getOrders(),
            dashboardApi.getProducts(),
            dashboardApi.getRevenueOverview()
        ]);

        return { stats, users, payments, orders, products, revenue };
    }
};

// User API functions  
export const userApi = {
    getProfile: (): Promise<UserProfile> => apiClient.get<UserProfile>('/api/user/profile'),
    updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> =>
        apiClient.put<UserProfile>('/api/user/profile', data)
};

// Auth API functions
export const authApi = {
    login: (credentials: LoginCredentials): Promise<{ token: string; user: UserProfile }> =>
        apiClient.post('/api/auth/login', credentials),
    register: (userData: RegisterData): Promise<{ token: string; user: UserProfile }> =>
        apiClient.post('/api/auth/register', userData),
    logout: (): Promise<void> => apiClient.post('/api/auth/logout'),
    refreshToken: (): Promise<{ token: string }> => apiClient.post('/api/auth/refresh')
};