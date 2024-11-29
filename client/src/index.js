import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"; // Thêm vào đây
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { persistor, store } from "./Redux/store";

// Tạo theme tùy chỉnh nếu cần thiết
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Màu chủ đạo
    },
    secondary: {
      main: "#dc004e", // Màu phụ
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}> 
          <CssBaseline /> 
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
