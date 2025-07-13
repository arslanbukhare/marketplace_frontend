import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MarketplaceHome from './pages/marketplace/Home';
import MyAdsPage from './pages/marketplace/MyAdsPage';
import AdDetailPage from './pages/marketplace/AdDetailPage';
import PublicAdDetailPage from './pages/marketplace/PublicAdDetailPage';
import AdSearchPage from './pages/marketplace/AdSearchPage';
import AdSuccess from './pages/marketplace/AdSuccess';
import EditAdPage from './pages/marketplace/EditAdPage';
import DiscountsHome from './pages/discounts/Home';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import PostAdForm from './components/adPost/PostAdForm';


const App = () => (
  <div data-theme="mytheme" className='bg-white'>
    <Toaster position="top-right" reverseOrder={false} />
    
    <Routes>
      <Route path="/" element={<MarketplaceHome />} />
      <Route path="/discounts" element={<DiscountsHome />} />
      <Route path="/post-ad" element={<PostAdForm />} />
      <Route path="/my-ads" element={<MyAdsPage />} />
      <Route path="/ads/:id" element={<AdDetailPage />} />
      <Route path="/public-ads/:id" element={<PublicAdDetailPage />} />
      <Route path="/ads/:id/edit" element={<EditAdPage />} />
      <Route path="/ad-success" element={<AdSuccess />} />
      <Route path="/search" element={<AdSearchPage />} />
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
