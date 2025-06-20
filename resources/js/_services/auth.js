import { useJwt } from "react-jwt";
import { API } from "../_api";

export const getUser = async () => {
    const { data } = await API.get('/users');
    return data.data || data;
};

// kode untuk menghapus data user
export const deleteUser = async (id) => {
  try {
    await API.delete(`/users/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showUser = async (id) => {
  try {
    const {data} = await API.get(`/users/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateUser = async (id, userData) => {
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');  // INI PENTING!

    Object.keys(userData).forEach(key => {
      if (userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });

    const response = await API.post(`/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

// kode untuk memperbarui data
export const updateUserRole = async (id, data) => {
  const response = await API.put(`/update-role/${id}`, data);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/register', userData);
  return response.data;
};

export const loginUser = async ({username, password}) => {
  const response = await API.post("/login", {username, password});
  return response.data;
};

export const logout = async ({token}) => {
  try {
    const {data} = await API.post("/logout", {token}, {
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    localStorage.removeItem("accessToken");
    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const useDecodeToken = () => {
  const token = localStorage.getItem("accessToken");
  const { decodedToken, isExpired } = useJwt(token);

  if (!token) {
    return {
      success: false,
      message: "No token",
      data: null,
    };
  }

  if (isExpired) {
    return {
      success: false,
      message: "Token expired",
      data: null,
    };
  }

  return {
    success: true,
    message: "Token valid",
    data: decodedToken,
  };
};


export const updateUserPassword = async (id, data) => {
  try {
    console.log("Sending POST request to:", `/users/${id}/update-password`);
    console.log("User ID:", id);
    console.log("Data keys:", Object.keys(data));

    const formData = new FormData();
    // Tidak perlu _method karena sudah POST
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);

    const response = await API.post(`/users/${id}/update-password`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Response success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal update password:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
};

