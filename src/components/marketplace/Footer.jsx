export default function Footer() {
  return (
    <footer className="footer bg-base-200 text-base-content py-8">
      <div className="container mx-auto px-4 text-center space-y-4">
        {/* Brand */}
        <div className="text-xl font-bold text-primary">MyAds</div>

        {/* Navigation */}
        <nav className="space-x-4">
          <a href="#" className="link link-hover">Home</a>
          <a href="#" className="link link-hover">Categories</a>
          <a href="#" className="link link-hover">Contact</a>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-base-content/60">
          &copy; 2025 MyAds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
