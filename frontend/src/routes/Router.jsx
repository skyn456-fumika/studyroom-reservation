import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import RoomListPage from '../pages/RoomListPage';
import RoomDetailPage from '../pages/RoomDetailPage';
import MyReservationsPage from '../pages/MyReservationsPage';
import AdminPage from '../pages/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RoomListPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'rooms/:roomId',
        element: <RoomDetailPage />,
      },
      {
        path: 'my-reservations',
        element: (
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;