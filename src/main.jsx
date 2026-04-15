import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./styles.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./Context/AuthContext";

createRoot(document.getElementById("root")).render(
  // AuthProvider로 감싸서 전역 상태를 사용할 수 있도록 함
  <AuthProvider>
    <RouterProvider router={router} />
    <Toaster />
  </AuthProvider>,
);
