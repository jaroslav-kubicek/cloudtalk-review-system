import { createBrowserRouter, redirect } from 'react-router';
import { RootLayout, rootLoader } from '@/routes/root';
import { loginAction } from '@/routes/login';
import { logoutAction } from '@/routes/logout';
import { ProductsList } from '@/routes/products';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    loader: rootLoader,
    children: [
      { index: true, loader: () => redirect('/products') },
      { path: 'login', action: loginAction },
      { path: 'logout', action: logoutAction },
      { path: 'products', Component: ProductsList },
    ],
  },
]);
