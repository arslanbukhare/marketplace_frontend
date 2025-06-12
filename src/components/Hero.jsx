export default function Hero() {
  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center flex flex-col max-w-2xl w-full">
        {/* Heading */}
        <h1 className="text-5xl font-bold text-primary mb-4">
          Find Everything You Need
        </h1>

        {/* Subheading */}
        <p className="text-lg text-base-content mb-6">
          Buy, sell, or rent anything near you.
        </p>

        {/* Search Bar with Embedded Dropdown */}
        <div className="form-control w-full mb-6">
          <div className="flex items-center border border-base-300 rounded-lg bg-white h-14 overflow-hidden">
            {/* Category Dropdown */}
            <select className="h-full px-4 text-base bg-white border-r border-base-300 focus:outline-none">
              <option>All</option>
              <option>Cars</option>
              <option>Real Estate</option>
              <option>Jobs</option>
              <option>Electronics</option>
              <option>Services</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for ads..."
              className="w-full h-full px-4 text-base bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
