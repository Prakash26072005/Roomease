// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true, // 🔥 auto send cookies
// });

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // 🔥 cookies auto send
});

// ================= REFRESH CONTROL =================
let isRefreshing = false;
let queue = [];

// resolve/reject all queued requests
const processQueue = (error) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  queue = [];
};

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // ❌ If refresh itself fails → stop
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(err);
    }

    // ================= HANDLE 401 =================
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🔁 If already refreshing → queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // 🔥 Call refresh API
        await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // ✅ resolve queued requests
        processQueue();

        // 🔁 retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ reject queued requests
        processQueue(refreshError);

        // ⚠️ DO NOT redirect here (important)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;