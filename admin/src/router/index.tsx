import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import MeetTimes from "../pages/MeetTimes";
import Reservations from "../pages/Reservations";
import FeaturedDeals from "../pages/FeaturedDeals";
import Raffle from "../pages/Raffle";
import Categories from "../pages/Categories";
import Users from "../pages/Users";
import Login from "../pages/Login";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { AdminRoute } from "../auth/AdminRoute";
import DraftRoute from "./DraftRoute";
import ImageLibrary from "../pages/ImageLibrary";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DraftRoute />,
        children: [
          {
            path: "/",
            element: <AdminLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "products", element: <Products /> },
              { path: "meet-times", element: <MeetTimes /> },
              { path: "reservations", element: <Reservations /> },
              { path: "featured-deals", element: <FeaturedDeals /> },
              { path: "image-library", element: <ImageLibrary /> },
              { path: "raffle", element: <Raffle /> },
              { path: "categories", element: <Categories /> },
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: "users",
                    element: <Users />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
