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

        {/* Search Box */}
        <div className="form-control w-full mb-6">
          <input
            type="text"
            placeholder="Search for ads..."
            className="input input-bordered input-lg w-full"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {['Cars', 'Real Estate', 'Jobs', 'Electronics', 'Services'].map((cat) => (
            <button
              key={cat}
              className="btn btn-primary btn-outline"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
