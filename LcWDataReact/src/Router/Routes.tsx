import { createBrowserRouter } from "react-router-dom";
import App from "../Components/App";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import LoginPage from "../Pages/LoginPage";
import MarketPlacesPage from "../Pages/MarketPlacesPage";
import FavoritesPage from "../Pages/FavoritesPage";
import ProductListPage from "../Pages/Catalog/ProductList";
import ProductDetail from "../Pages/Catalog/ProductDetails";
import ProfileSettings from "../Pages/ProfileSettingsPage";
import ReturnPage from "../Pages/ReturnPage";
import OrdersPage from "../Pages/OrdersPage";
import CartPage from "../Pages/CartPage";
import ReturnNewPage from "../Pages/ReturnNewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/marketplaces", element: <MarketPlacesPage /> },
      { path: "/favorites", element: <FavoritesPage /> },
      { path: "/Products", element: <ProductListPage /> },
      { path: "/category/:category", element: <ProductListPage /> },
      { path: "/catalog/:category/:id", element: <ProductDetail /> },
      { path: "/profileSettings/:id", element: <ProfileSettings /> },
      { path: "/returns", element: <ReturnPage /> },
      { path: "/orders", element: < OrdersPage /> },
      { path: "/cart", element: < CartPage /> },
      { path: "/favorites", element: < FavoritesPage /> },
      {path : "/returns/new", element : <ReturnNewPage/>}


    ],
  },
]);
