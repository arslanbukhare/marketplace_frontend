import Header from './components/Header'
import Hero from './components/Hero'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" data-theme="dark">
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <main className="flex-grow">
        <Hero />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
