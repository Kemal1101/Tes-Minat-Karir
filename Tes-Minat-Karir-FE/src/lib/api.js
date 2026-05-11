const API_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString()
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  register: async (username, password, nama_lengkap) => {
    const res = await fetch(`${API_URL}/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        nama_lengkap
      })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Registration failed");
    }
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/v1/logout`, {
      method: "POST",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_URL}/v1/users/all`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },
  createUser: async (data) => {
    const res = await fetch(`${API_URL}/v1/users/`, {
      method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },
  updateUser: async (id, data) => {
    const res = await fetch(`${API_URL}/v1/users/${id}`, {
      method: "PUT", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },
  deleteUser: async (id) => {
    const res = await fetch(`${API_URL}/v1/users/${id}`, {
      method: "DELETE", headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
  },

  getQuestions: async () => {
    const res = await fetch(`${API_URL}/v1/questions/all`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch questions");
    return res.json();
  },
  createQuestion: async (data) => {
    const res = await fetch(`${API_URL}/v1/questions/`, {
      method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create question");
    return res.json();
  },
  updateQuestion: async (id, data) => {
    const res = await fetch(`${API_URL}/v1/questions/${id}`, {
      method: "PUT", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update question");
    return res.json();
  },
  deleteQuestion: async (id) => {
    const res = await fetch(`${API_URL}/v1/questions/${id}`, {
      method: "DELETE", headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete question");
    return res.json();
  },

  getOccupations: async () => {
    const res = await fetch(`${API_URL}/v1/occupations/all`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch occupations");
    return res.json();
  },
  createOccupation: async (data) => {
    const res = await fetch(`${API_URL}/v1/occupations/`, {
      method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create occupation");
    return res.json();
  },
  updateOccupation: async (id, data) => {
    const res = await fetch(`${API_URL}/v1/occupations/${id}`, {
      method: "PUT", headers: getHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update occupation");
    return res.json();
  },
  deleteOccupation: async (id) => {
    const res = await fetch(`${API_URL}/v1/occupations/${id}`, {
      method: "DELETE", headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete occupation");
    return res.json();
  },
  
  // Public Test Methods
  getPublicQuestions: async () => {
    const res = await fetch(`${API_URL}/v1/questions`);
    if (!res.ok) throw new Error("Failed to fetch questions");
    return res.json();
  },
  calculateResult: async (data) => {
    const res = await fetch(`${API_URL}/v1/calculate-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to calculate result");
    return res.json();
  }
};
