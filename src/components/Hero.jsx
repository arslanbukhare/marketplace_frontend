export default function Hero() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Everything You Need</h1>
        <p className="mb-6 text-gray-600">Buy, sell, or rent anything near you.</p>

        <div className="max-w-2xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Search for ads..."
            className="w-full p-4 border rounded"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {['Cars', 'Real Estate', 'Jobs', 'Electronics', 'Services'].map(cat => (
            <button key={cat} className="border text-white px-4 py-2 rounded shadow hover:bg-gray-200">
              {cat}
            </button>
            
          ))}
        </div>
      </div>
    </section>
  )
}
