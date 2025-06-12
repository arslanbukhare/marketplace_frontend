import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoriesList from './components/CategoriesList';
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import IndividualDashboard from "./pages/dashboard/IndividualDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Home Page layout
const Home = () => (
  <>
    <Header />
    <main className="flex-grow">
      <Hero />
      <CategoriesList />
      <CTA />
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" data-theme="light">
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard/company"
          element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
            }
            />
            <Route
            path="/dashboard/individual"
            element={
              <ProtectedRoute>
                <IndividualDashboard />
              </ProtectedRoute>
            }
          />
    </Routes>

    </div>
  );
}
