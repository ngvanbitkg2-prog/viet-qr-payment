const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  login: (username: string, password: string) =>
    fetchAPI<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string) =>
    fetchAPI<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => fetchAPI<any>('/auth/me'),
};

// Bank APIs
export const bankAPI = {
  getActiveBanks: () => fetchAPI<any[]>('/banks'),
};

// Payment APIs
export const paymentAPI = {
  createQR: (bankId: number, points: number) =>
    fetchAPI<any>('/payment/create-qr', {
      method: 'POST',
      body: JSON.stringify({ bankId, points }),
    }),

  getMyTransactions: () => fetchAPI<any[]>('/payment/my-transactions'),
};

// Admin APIs
export const adminAPI = {
  // Banks
  getAllBanks: () => fetchAPI<any[]>('/admin/banks'),

  createBank: (data: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) =>
    fetchAPI<any>('/admin/banks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBank: (
    id: number,
    data: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
    }
  ) =>
    fetchAPI<any>(`/admin/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBank: (id: number) =>
    fetchAPI<any>(`/admin/banks/${id}`, {
      method: 'DELETE',
    }),

  toggleBank: (id: number) =>
    fetchAPI<any>(`/admin/banks/${id}/toggle`, {
      method: 'PATCH',
    }),

  // Transactions
  getAllTransactions: () => fetchAPI<any[]>('/admin/transactions'),

  confirmTransaction: (id: number) =>
    fetchAPI<any>(`/admin/transactions/${id}/confirm`, {
      method: 'POST',
    }),

  rejectTransaction: (id: number) =>
    fetchAPI<any>(`/admin/transactions/${id}/reject`, {
      method: 'POST',
    }),
};
