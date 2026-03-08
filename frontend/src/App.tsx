import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; // We'll create this below
import Dashboard from './pages/Dashboard'; // We'll create this below
import { getStoredUser } from './services/authService';
import { Toaster } from 'sonner';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';

function App() {
  const auth = getStoredUser();
  const isAuthenticated = !!auth?.token;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/transactions"
                element={<div>Transactions View</div>}
              />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/settings" element={<div>Settings View</div>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
