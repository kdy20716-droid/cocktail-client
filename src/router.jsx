import { createBrowserRouter } from "react-router-dom";
import RecipeAddPage from "./pages/RecipeAddPage";
import RecipeEditPage from "./pages/RecipeEditPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MyPage from "./pages/MyPage";
import OldRecipeDetailPage from "./pages/old_RecipeDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: "/add",
        element: <RecipeAddPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetailPage />,
      },
      {
        path: "/recipes/:id/edit",
        element: <RecipeEditPage />,
      },
      {
        path: "/old-recipes/:id",
        element: <OldRecipeDetailPage />,
      },
    ],
  },
]);

export default router;
