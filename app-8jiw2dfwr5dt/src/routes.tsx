import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Watch from './pages/Watch';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Filter from './pages/Filter';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
  },
  {
    name: 'Filter',
    path: '/filter',
    element: <Filter />,
    visible: false,
  },
  {
    name: 'Anime Detail',
    path: '/anime/:slug',
    element: <AnimeDetail />,
    visible: false,
  },
  {
    name: 'Watch',
    path: '/watch/:slug/:season/:episode',
    element: <Watch />,
    visible: false,
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <Favorites />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <Admin />,
    visible: false,
  },
];

export default routes;
