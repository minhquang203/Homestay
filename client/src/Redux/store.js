// store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./state"; // Đảm bảo đúng đường dẫn đến state.js

// Cấu hình Redux Persist
const persistConfig = {
  key: "root", // Tên của key trong localStorage
  version: 1, // Phiên bản của state để khi có thay đổi sẽ cập nhật lại
  storage, // Chọn phương thức lưu trữ, có thể là localStorage hoặc sessionStorage
};

// Tạo persisted reducer từ userReducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// Tạo store với persistedReducer
export const store = configureStore({
  reducer: persistedReducer, // Dùng persisted reducer để lưu trữ trạng thái người dùng
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Bỏ qua các action không thể serialize
      },
    }),
});

// Khởi tạo persistor từ store
export const persistor = persistStore(store);
