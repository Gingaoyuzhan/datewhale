import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { LoginPage } from './pages/LoginPage';
import { GardenPage } from './pages/GardenPage';
import { TimelinePage } from './pages/TimelinePage';
import { useAuthStore } from './stores/authStore';

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // 等待 hydration 完成
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-warm">
        <div className="text-ink-500">加载中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/garden"
          element={
            <ProtectedRoute>
              <GardenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <ProtectedRoute>
              <TimelinePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
