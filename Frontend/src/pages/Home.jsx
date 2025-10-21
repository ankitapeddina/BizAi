import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--offwhite)] relative overflow-hidden">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold" style={{ color: "#0D1B2A" }}>
          BizAI is dodne by sard
        </h1>
        <nav className="space-x-6">
          <Link to="/dashboard" className="text-[#415A77] hover:text-[#1B263B]">
            Dashboard
          </Link>
          <Link to="/login" className="bg-[#415A77] text-[#E0E1DD] px-4 py-2 rounded-lg hover:bg-[#1B263B] transition">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center">
        <h2 className="text-5xl font-bold mb-4 text-[#0D1B2A]">
          Soch Smart, Sell Smarter 💡
        </h2>
        <p className="text-lg text-[#415A77] max-w-xl mb-6">
          Transform your business decisions with real-time AI insights, forecasts, and recommendations.
        </p>
        <div className="space-x-4">
          <Link to="/dashboard" className="bg-[#1B263B] text-[#E0E1DD] px-6 py-3 rounded-lg hover:bg-[#0D1B2A] transition">
            Demo Dashboard
          </Link>
          <Link to="/register" className="border border-[#415A77] text-[#415A77] px-6 py-3 rounded-lg hover:bg-[#B3AF8F] hover:text-[#0D1B2A] transition">
            Register
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
