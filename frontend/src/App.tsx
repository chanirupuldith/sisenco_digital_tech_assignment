import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { getStoredUser } from './services/authService';
import { Toaster } from 'sonner';

function App() {
  const auth = getStoredUser();
  const isAuthenticated = !!auth?.token;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <Routes>
          {/* Root Path Logic:
          If logged in -> Dashboard
          If NOT logged in -> Auth (Login/Register)
        */}
          <Route
            path="/"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Navigate to="/login" replace />
            }
          />

          {/* Auth Page */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <div className="p-10 bg-slate-50 min-h-screen">
                  <h1 className="text-3xl font-bold text-slate-900">
                    Welcome, {auth?.user.username}!
                  </h1>
                  <p className="text-slate-500 mt-2">Your ERP Dashboard is ready.</p>

                  {/* Temporary Logout for testing */}
                  <button
                    onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                    className="mt-6 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                  >
                    Sign Out
                  </button>
                </div>
              }
            />
          </Route>

          {/* Catch-all: Send everything back to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;