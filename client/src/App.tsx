import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import DebateRoom from './pages/DebateRoom.tsx';
import Summary from './pages/Summary.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import AboutUs from './pages/AboutUs.tsx';

// Create router with future flags to silence deprecation warnings
const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutUs /> },
    { path: "/debate/:debateId", element: <DebateRoom /> },
    { path: "/summary/:debateId", element: <Summary /> },
    { path: "/leaderboard", element: <Leaderboard /> },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen">
      <RouterProvider 
        router={router} 
        future={{
          v7_startTransition: true,
        }}
      />
    </div>
  );
}

export default App;
