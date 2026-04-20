// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true, // 🔥 cookies send
// });

// // ================= LOGOUT FLAG =================
// let isRefreshing = false;
// let isLoggingOut = false;
// let queue = [];

// // 🔥 export setter (logout ke liye)
// export const setIsLoggingOut = (value) => {
//   isLoggingOut = value;
// };

// // ================= PROCESS QUEUE =================
// const processQueue = (error) => {
//   queue.forEach((p) => {
//     if (error) p.reject(error);
//     else p.resolve();
//   });
//   queue = [];
// };

// // ================= RESPONSE INTERCEPTOR =================
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     // ❌ agar refresh hi fail ho raha → stop
//     if (originalRequest.url.includes("/auth/refresh")) {
//       return Promise.reject(err);
//     }

//     // ================= HANDLE 401 =================
//     if (
//       err.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isLoggingOut // 🔥 logout ke time refresh block
//     ) {
//       originalRequest._retry = true;

//       // 🔁 agar already refresh ho raha → queue me daalo
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       isRefreshing = true;

//       try {
//         // 🔥 refresh call
//         await axios.post(
//           "http://localhost:5000/api/auth/refresh",
//           {},
//           { withCredentials: true }
//         );

//         // ✅ queue resolve
//         processQueue();

//         // 🔁 retry original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         // ❌ queue reject
//         processQueue(refreshError);

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ================= LOGOUT FLAG =================
let isRefreshing = false;
let isLoggingOut = false;
let queue = [];

// 🔥 export setter (logout ke liye)
export const setIsLoggingOut = (value) => {
  isLoggingOut = value;
};

// ================= PROCESS QUEUE =================
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

    // ❌ agar refresh hi fail ho raha → stop
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(err);
    }

    // ================= HANDLE 401 =================
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoggingOut // 🔥 logout ke time refresh block
    ) {
      originalRequest._retry = true;

      // 🔁 agar already refresh ho raha → queue me daalo
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // 🔥 refresh call
       await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
  {},
  { withCredentials: true }
);

        // ✅ queue resolve
        processQueue();

        // 🔁 retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ queue reject
        processQueue(refreshError);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;