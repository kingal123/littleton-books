import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import ProtectedRoute from "@/routes/ProtectedRoute"; // ✅ Import
import DashboardPage from "@/routes/dashboard/page";
import ReportsPage from "@/routes/reports/page";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";

function App() {
    const router = createBrowserRouter([
        // ✅ Auth routes (public)
        {
            path: "/signup",
            element: <Signup />,
        },
        {
            path: "/login",
            element: <Login />,
        },

        // ✅ Protected routes (dashboard, etc.)
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <DashboardPage /> },
                { path: "analytics", element: <h1 className="title">Analytics</h1> },
                { path: "orders", element: <h1 className="title">Orders</h1> },
                { path: "new-order", element: <h1 className="title">New Order</h1> },
                { path: "order-history", element: <h1 className="title">Order History</h1> },
                { path: "books", element: <h1 className="title">Books</h1> },
                { path: "new-product", element: <h1 className="title">New Book</h1> },
                { path: "inventory", element: <h1 className="title">Inventory</h1> },
                {
                    path: "reports",
                    element: <ReportsPage />,
                },

        { path: "signup", element: <h1 className="title">Add User</h1> },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
