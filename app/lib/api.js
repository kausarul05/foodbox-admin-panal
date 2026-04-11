// API Base URL configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken')
  }
  return null
}

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken()

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth APIs
export const authAPI = {
  adminLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => {
    return apiCall('/admin/stats')
  },

  // Get recent activities
  getRecentActivities: () => {
    return apiCall('/admin/activities')
  }
}

// Package APIs
export const packageAPI = {
  // Get all packages
  getAllPackages: () => {
    return apiCall('/packages')
  },

  // Get single package
  getPackageById: id => {
    return apiCall(`/packages/${id}`)
  },

  // Create package (Admin)
  createPackage: packageData => {
    return apiCall('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    })
  },

  // Update package (Admin)
  updatePackage: (id, packageData) => {
    return apiCall(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(packageData)
    })
  },

  // Delete package (Admin)
  deletePackage: id => {
    return apiCall(`/packages/${id}`, {
      method: 'DELETE'
    })
  }
}

// Menu APIs
export const menuAPI = {
  // Get menu by package
  getMenuByPackage: packageType => {
    return apiCall(`/menu/package/${packageType}`)
  },

  // Get all menu (Admin)
  getAllMenu: () => {
    return apiCall('/menu')
  },

  // Create menu item (Admin)
  createMenuItem: menuData => {
    return apiCall('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData)
    })
  },

  // Update menu item (Admin)
  updateMenuItem: (id, menuData) => {
    return apiCall(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData)
    })
  },

  // Delete menu item (Admin)
  deleteMenuItem: id => {
    return apiCall(`/menu/${id}`, {
      method: 'DELETE'
    })
  },

  // Bulk update menu
  bulkUpdateMenu: items => {
    return apiCall('/menu/bulk', {
      method: 'PUT',
      body: JSON.stringify({ items })
    })
  }
}

// Order APIs
export const orderAPI = {
  // Get all orders (Admin)
  getAllOrders: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/orders${queryParams ? `?${queryParams}` : ''}`)
  },

  // Get order by ID
  getOrderById: id => {
    return apiCall(`/orders/${id}`)
  },

  // Update order status (Admin)
  updateOrderStatus: (id, status) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  },

  // Cancel order (Admin)
  cancelOrder: (id, reason) => {
    return apiCall(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    })
  },

  // Get order stats (Admin)
  getOrderStats: () => {
    return apiCall('/orders/stats')
  }
}

// Subscription APIs
export const subscriptionAPI = {
  // Get all subscriptions (Admin)
  getAllSubscriptions: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/subscriptions${queryParams ? `?${queryParams}` : ''}`)
  },

  // Get pending subscriptions (Admin)
  getPendingSubscriptions: () => {
    return apiCall('/subscriptions/pending')
  },

  // Approve subscription (Admin)
  approveSubscription: id => {
    return apiCall(`/subscriptions/${id}/approve`, {
      method: 'PUT'
    })
  },

  // Reject subscription (Admin)
  rejectSubscription: (id, reason) => {
    return apiCall(`/subscriptions/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    })
  },

  // Get subscription stats (Admin)
  getSubscriptionStats: () => {
    return apiCall('/subscriptions/stats')
  }
}

// User Management APIs (Admin)
export const userAPI = {
  // Get all users
  getAllUsers: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/admin/users${queryParams ? `?${queryParams}` : ''}`)
  },

  // Get user by ID
  getUserById: id => {
    return apiCall(`/admin/users/${id}`)
  },

  // Update user (Admin)
  updateUser: (id, userData) => {
    return apiCall(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  // Delete user (Admin)
  deleteUser: id => {
    return apiCall(`/admin/users/${id}`, {
      method: 'DELETE'
    })
  },

  // Update user wallet (Admin)
  updateUserWallet: (id, amount, action, reason) => {
    return apiCall(`/admin/users/${id}/wallet`, {
      method: 'PUT',
      body: JSON.stringify({ amount, action, reason })
    })
  }
}

// Settings APIs
export const settingsAPI = {
  // Get system settings
  getSettings: () => {
    return apiCall('/admin/settings')
  },

  // Update system settings
  updateSettings: settingsData => {
    return apiCall('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  }
}

// Export API
export const exportAPI = {
  exportData: (type, startDate, endDate) => {
    const queryParams = new URLSearchParams({ startDate, endDate }).toString()
    return apiCall(
      `/admin/export/${type}${queryParams ? `?${queryParams}` : ''}`
    )
  }
}

// Default export
const API = {
  auth: authAPI,
  dashboard: dashboardAPI,
  packages: packageAPI,
  menu: menuAPI,
  orders: orderAPI,
  subscriptions: subscriptionAPI,
  users: userAPI,
  settings: settingsAPI,
  export: exportAPI
}

export default API
