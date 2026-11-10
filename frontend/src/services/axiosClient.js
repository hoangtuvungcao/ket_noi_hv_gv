/**
 * cấu hình axios client dùng chung cho toàn bộ dự án
 * tuân thủ chặt chẽ đặc tả kết nối mục 3.1:
 * - baseURL lấy từ biến môi trường VITE_API_URL
 * - withCredentials: true (cho phép gửi nhận cookie httponly refresh token)
 * - request interceptor: tự động đính kèm access token vào header Authorization
 * - response interceptor: khi nhận lỗi 401 tự động gọi /auth/refresh để lấy token mới và gửi lại request cũ
 */

import axios from 'axios';

// lấy địa chỉ api từ biến môi trường vite hoặc fallback về cổng 5000 local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// biến lưu trữ access token trong bộ nhớ ram (memory) theo tiêu chuẩn bảo mật tầng 1 (không lưu localStorage)
let memoryAccessToken = null;
let logoutCallback = null;

export const setAccessToken = (token) => {
  memoryAccessToken = token;
};

export const getAccessToken = () => {
  return memoryAccessToken;
};

export const setLogoutHandler = (callback) => {
  logoutCallback = callback;
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // gửi cookie httponly kèm theo mọi request
  headers: {
    'Content-Type': 'application/json',
  },
});

// hàng đợi lưu trữ các yêu cầu bị tạm dừng trong khi đang làm mới token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * bộ chặn yêu cầu (request interceptor): tự động gắn token truy cập vào header
 */
axiosClient.interceptors.request.use(
  (config) => {
    if (memoryAccessToken) {
      config.headers.Authorization = `Bearer ${memoryAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * bộ chặn phản hồi (response interceptor): tự động xử lý khi access token hết hạn (mã lỗi 401)
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // trả về trực tiếp dữ liệu { success, message, data }
  },
  async (error) => {
    const originalRequest = error.config;

    // nếu không phải lỗi từ server phản hồi (ví dụ lỗi mạng mất kết nối)
    if (!error.response) {
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'không thể kết nối tới máy chủ, vui lòng kiểm tra kết nối mạng',
        },
      });
    }

    // kiểm tra nếu nhận mã lỗi 401 và không phải là request đăng nhập/refresh
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // nếu đang trong quá trình refresh token, đưa request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // gọi api refresh token (sử dụng cookie httponly)
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);

          // gắn token mới vào request ban đầu và thực hiện lại
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // nếu refresh token cũng thất bại (hết hạn 7 ngày hoặc bị thu hồi), tiến hành đăng xuất
        processQueue(refreshError, null);
        setAccessToken(null);
        if (logoutCallback) {
          logoutCallback();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // chuẩn hóa lỗi trả về cho các component gọi api dễ dàng hiển thị thông báo
    const errorData = error.response?.data || {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'đã có lỗi xảy ra từ máy chủ',
      },
    };

    return Promise.reject(errorData);
  }
);

export default axiosClient;

