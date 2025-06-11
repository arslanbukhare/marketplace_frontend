export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div className="text-xl font-bold">MyAds</div>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Categories</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>
        <p className="text-sm text-gray-400">&copy; 2025 MyAds. All rights reserved.</p>
      </div>
    </footer>
  )
}
