const API_BASE_URL = 'http://localhost:8084';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // For delete/empty responses
    if (response.status === 204 || response.status === 205) {
      return null;
    }

    // Handle delete endpoint custom text response "hotel deleted successfully"
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Something went wrong');
      }
      return text;
    }
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const api = {
  // --- USER SERVICE ---
  users: {
    getAll: () => request('/api/users/getAllUser'),
    getById: (id) => request(`/api/users/getUserById/${id}`),
    create: (userData) => request('/api/users/create', {
      method: 'POST',
      body: userData,
    }),
    update: (id, userData) => request(`/api/users/updateUser/${id}`, {
      method: 'PUT',
      body: userData,
    }),
    delete: (id) => request(`/api/users/delete/${id}`, {
      method: 'DELETE',
    }),
  },

  // --- HOTEL SERVICE ---
  hotels: {
    getAll: () => request('/api/hotel/getAllHotel'),
    getById: (id) => request(`/api/hotel/getById/${id}`),
    create: (hotelData) => request('/api/hotel/create', {
      method: 'POST',
      body: hotelData,
    }),
    update: (id, hotelData) => request(`/api/hotel/update/${id}`, {
      method: 'PUT',
      body: hotelData,
    }),
    delete: (id) => request(`/api/hotel/deletById/${id}`, {
      method: 'DELETE',
    }),
  },

  // --- RATING SERVICE ---
  ratings: {
    getAll: () => request('/api/rating/getAllRating'),
    getById: (id) => request(`/api/rating/getRatingById/${id}`),
    getByUserId: (userId) => request(`/api/rating/getRatingByUserId/${userId}`),
    getByHotelId: (hotelId) => request(`/api/rating/getRatingByHotelId/${hotelId}`),
    create: (ratingData) => request('/api/rating/create', {
      method: 'POST',
      body: ratingData,
    }),
  },
};
