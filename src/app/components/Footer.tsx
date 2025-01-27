// components/Footer.js
export default function Footer() {
    return (
      <footer className=" text-gray-500 py-10 mt-20">
        <div className="bg-gray-300 h-[1px] w-full"/>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-semibold">Hire Different™</h2>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="email@gmail.com"
                className="px-4 py-2 rounded-l bg-gray-800 text-white outline-none"
              />
              <button className="px-4 py-2 bg-yellow-400 text-black rounded-r hover:bg-yellow-500">
                Join for free
              </button>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram text-white"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter text-white"></i>
              </a>
              <a href="#" aria-label="Email">
                <i className="fas fa-envelope text-white"></i>
              </a>
            </div>
          </div>
  
          {/* Find Work Section */}
          <div>
            <h2 className="text-lg font-semibold">Find Work</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">Explore Jobs</a></li>
              <li><a href="#" className="hover:underline">Discover Companies</a></li>
              <li><a href="#" className="hover:underline">Browse Collections</a></li>
            </ul>
          </div>
  
          {/* Find People Section */}
          <div>
            <h2 className="text-lg font-semibold">Find People</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">Learn More</a></li>
              <li><a href="#" className="hover:underline">Sign Up</a></li>
            </ul>
          </div>
  
          {/* Company Section */}
          <div>
            <h2 className="text-lg font-semibold">Company</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
  
        {/* Branding */}
        <div className="text-center mt-10">
          <h1 className="text-5xl font-bold text-white">parallel</h1>
        </div>
      </footer>
    );
  }
  