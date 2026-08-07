import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import MeetTimes from "../pages/MeetTimes";
import Reservations from "../pages/Reservations";
import FeaturedDeals from "../pages/FeaturedDeals";
import Raffle from "../pages/Raffle";
import Categories from "../pages/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "meet-times", element: <MeetTimes /> },
      { path: "reservations", element: <Reservations /> },
      { path: "featured-deals", element: <FeaturedDeals /> },
      { path: "raffle", element: <Raffle /> },
      { path: "categories", element: <Categories /> },
    ],
  },
]);

export default router;
