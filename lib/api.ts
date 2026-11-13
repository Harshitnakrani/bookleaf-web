export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://bookleaf-server-kq8x.onrender.com/api';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bookleaf_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('bookleaf_token', token);
  } else {
    localStorage.removeItem('bookleaf_token');
  }
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('bookleaf_user');
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: any | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('bookleaf_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('bookleaf_user');
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ message: string; accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: any) =>
    request<{ message: string; accessToken: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),

  getMe: () => request<any>('/auth/me'),

  getUsers: (role?: string) =>
    request<any[]>(`/auth/users${role ? `?role=${role}` : ''}`),

  // Books
  getMyBooks: () => request<any[]>('/books'),

  getMyBooksSummary: () => request<any>('/books/summary'),

  getAllBooksAdmin: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/books/admin/all?${query}`);
  },

  getBookById: (id: string) => request<any>(`/books/${id}`),

  // Tickets
  createTicket: (payload: {
    subject: string;
    description: string;
    bookId?: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }) =>
    request<any>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTickets: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/tickets?${query}`);
  },

  getTicketById: (id: string) => request<any>(`/tickets/${id}`),

  getAiDraft: (id: string) =>
    request<{
      aiAvailable: boolean;
      draft: string | null;
      isCached: boolean;
      modelUsed?: string;
    }>(`/tickets/${id}/ai-draft`),

  addMessage: (
    ticketId: string,
    payload: { content: string; isInternalNote?: boolean },
  ) =>
    request<any>(`/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateStatus: (ticketId: string, status: string) =>
    request<any>(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  overrideTicket: (
    ticketId: string,
    payload: { category?: string; priority?: string },
  ) =>
    request<any>(`/tickets/${ticketId}/override`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  assignTicket: (ticketId: string, assignedToId: string | null) =>
    request<any>(`/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedToId }),
    }),

  retriggerTriage: (ticketId: string) =>
    request<any>(`/tickets/${ticketId}/ai-reclassify`, {
      method: 'POST',
    }),

  // Knowledge Base
  getKnowledgeBase: () =>
    request<{ companyOverview: string; sections: any[] }>('/knowledge-base'),
};
