import axios from "axios";

const axiosAuth = axios.create({
  baseURL: 'https://mytshop.runasp.net/api/',
});
axiosAuth.interceptors.request.use(config => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default axiosAuth;
