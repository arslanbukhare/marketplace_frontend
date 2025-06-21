import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MarketplaceHome from './pages/marketplace/Home';
import DiscountsHome from './pages/discounts/Home';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/shared/ProtectedRoute';


const App = () => (
  <div data-theme="light">
    <Toaster position="top-right" reverseOrder={false} />
    
    <Routes>
      <Route path="/" element={<MarketplaceHome />} />
      <Route path="/discounts" element={<DiscountsHome />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </div>
);

export default App;
