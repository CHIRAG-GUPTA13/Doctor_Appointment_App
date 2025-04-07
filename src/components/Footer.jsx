import { assets } from "../assets/assets"

function Footer() {
  return (
    <footer className="bg-gray-50 mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
          <div onClick={() => navigate('/')} className="w-50 cursor-pointer text-3xl font-bold text-blue-600">
        Care Connect
      </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              care connect is your trusted healthcare partner, providing innovative solutions for a seamless medical experience. We're committed to making quality healthcare accessible and convenient for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#5f6FFF] transition-colors duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#5f6FFF] transition-colors duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#5f6FFF] transition-colors duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-600 hover:text-[#5f6FFF] transition-colors duration-300">Home</a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-[#5f6FFF] transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-[#5f6FFF] transition-colors duration-300">Contact Us</a>
              </li>
             
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <i className="fas fa-phone-alt mr-3 text-[#5f6FFF]"></i>
                +91 96626 62713
              </li>
              <li className="flex items-center text-gray-600">
                <i className="fas fa-envelope mr-3 text-[#5f6FFF]"></i>
                contact@careconnect.com
              </li>
              <li className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-3 text-[#5f6FFF]"></i>
                123 Healthcare Ave, Am 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Prescripto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer