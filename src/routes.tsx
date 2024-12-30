import { RouteObject } from "react-router-dom";
import Index from "./pages/IndexPage";
import CartPage from "./pages/CartPage";
import PaymentsPageWithStripe from "./pages/PaymentsPage";
import PaymentConfirmationPage from "./pages/ConfirmPage";
import OrdersPage from "./pages/OrdersPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  { path: "/payments/:id", element: <PaymentsPageWithStripe /> },
  { path: "/confirm", element: <PaymentConfirmationPage /> },
  { path: "/orders", element: <OrdersPage /> },
];
