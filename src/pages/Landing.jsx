import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../assets/bg1.jpg";
import img2 from "../assets/bg2.jpg";
import img3 from "../assets/bg3.jpg";
import logo from "../assets/bglogo.png";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const images = [img1, img2, img3];

function Landing() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Refs for scrolling to sections
  const aboutUsRef = useRef(null);
  const contactUsRef = useRef(null);

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when clicking on a link
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // ✅ Single login function - goes to unified login page
  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 relative">
      {/* Header */}
      <header className="w-full bg-white/20 backdrop-blur-sm border-b border-white/30 py-4 z-50 fixed top-0 left-0">
        <div className="w-full flex justify-between items-center px-4 sm:px-6">
          {/* Logo on Left */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto mr-2 sm:mr-4" />
            <span className="text-white font-bold text-lg sm:text-xl">TailorPro</span>
          </div>

          {/* Desktop Navigation & Login */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
            {/* Navigation Links */}
            <div className="flex space-x-8 lg:space-x-16">
              <button
                onClick={() => scrollToSection(aboutUsRef)}
                className="text-blue hover:text-blue-300 font-medium transition-colors duration-300 text-sm lg:text-base"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection(contactUsRef)}
                className="text-blue hover:text-blue-300 font-medium transition-colors duration-300 text-sm lg:text-base"
              >
                Contact Us
              </button>
            </div>

            {/* ✅ Single Login Button */}
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition flex items-center text-sm sm:text-base"
            >
              <FaUser className="mr-2" />
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white text-xl p-2"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 pt-20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute top-0 right-0 h-full w-64 bg-[#001f3f] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col p-6 space-y-6 mt-8">
                  <button
                    onClick={() => scrollToSection(aboutUsRef)}
                    className="text-white hover:text-blue-300 font-medium text-lg transition-colors duration-300 text-left py-2"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => scrollToSection(contactUsRef)}
                    className="text-white hover:text-blue-300 font-medium text-lg transition-colors duration-300 text-left py-2"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center mt-4"
                  >
                    <FaUser className="mr-2" />
                    Login
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden pt-16">
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center items-start px-4 sm:px-6 md:px-10 lg:px-20 text-white">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Tailor Management System
          </motion.h1>

          <motion.p
            className="max-w-full sm:max-w-lg text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 drop-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Elevate your tailoring business with seamless order tracking,
            customer management, and fabric inventory control—all in one smart
            system.
          </motion.p>

          <motion.button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-full shadow-lg flex items-center text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Get Started <FaArrowRight className="ml-2" />
          </motion.button>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                i === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-blue-700 mb-8 sm:mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Why Choose TailorPro?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Customer Management",
                desc: "Store all customer data, measurements, and preferences in one place.",
              },
              {
                title: "Smart Order Tracking",
                desc: "Track orders from measurement to delivery with real-time updates.",
              },
              {
                title: "Fabric Inventory Control",
                desc: "Manage your fabric stock efficiently with alerts and usage insights.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
              >
                <FaCheckCircle className="text-blue-600 text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutUsRef} className="bg-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 sm:mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            About Us
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-600 leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            TailorPro was created to modernize tailoring businesses. With smart
            digital tools, we help tailors focus more on their craft while we
            handle the business side—orders, fabrics, and customers. Our mission
            is to simplify your daily tasks and boost your productivity.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-blue-700 mb-8 sm:mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <p className="text-gray-600 italic mb-3 sm:mb-4 text-sm sm:text-base">
                  "TailorPro changed how I run my shop. Tracking orders and
                  fabrics is so easy now!"
                </p>
                <div className="flex justify-center text-yellow-400 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} size={14} className="sm:w-4 sm:h-4" />
                  ))}
                </div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">- Client {i}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={contactUsRef} className="bg-[#001f3f] text-white border-t border-blue-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">About Us</h2>
              <p className="text-sm sm:text-base">
                TailorPro is designed to streamline your tailoring business
                operations with smart tools to manage customers, orders, and
                fabrics efficiently.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={2}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Contact Us</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <FaPhone className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Call</p>
                    <p className="text-sm sm:text-base">(011) 286 7511</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Email</p>
                    <p className="text-sm sm:text-base">info@tailorsystem.com</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={3}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Business Hours</h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Mon-Fri</p>
                    <p className="text-sm sm:text-base">9:00 AM - 6:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Saturday</p>
                    <p className="text-sm sm:text-base">9:00 AM - 2:00 PM</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
            <a href="#" className="text-xl sm:text-2xl text-white hover:text-blue-300 transition">
              <FaFacebook />
            </a>
            <a href="#" className="text-xl sm:text-2xl text-white hover:text-blue-300 transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-xl sm:text-2xl text-white hover:text-blue-300 transition">
              <FaTwitter />
            </a>
          </div>

          <div className="border-t border-blue-800 pt-3 sm:pt-4 text-center text-xs sm:text-sm text-gray-300">
            <p>© {currentYear} Tailor Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;




// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import img1 from "../assets/bg1.jpg";
// import img2 from "../assets/bg2.jpg";
// import img3 from "../assets/bg3.jpg";
// import logo from "../assets/bglogo.png";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaClock,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaArrowRight,
//   FaCheckCircle,
//   FaStar,
//   FaUser,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i = 1) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.2,
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   }),
// };

// const images = [img1, img2, img3];

// function Landing() {
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const currentYear = new Date().getFullYear();

//   // Refs for scrolling to sections
//   const aboutUsRef = useRef(null);
//   const contactUsRef = useRef(null);

//   // Auto slide every 3s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // Close mobile menu when clicking on a link
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   // ✅ Single login function - goes to unified login page
//   const handleLogin = () => {
//     navigate("/login");
//     setIsMobileMenuOpen(false);
//   };

//   const handleGetStarted = () => {
//     navigate("/login");
//     setIsMobileMenuOpen(false);
//   };

//   const scrollToSection = (ref) => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//     setIsMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-white text-gray-800 relative">
//       {/* Header */}
//       <header className="w-full bg-white/20 backdrop-blur-sm border-b border-white/30 py-4 z-50 fixed top-0 left-0">
//         <div className="w-full flex justify-between items-center px-4 sm:px-6">
//           {/* Logo on Left */}
//           <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
//             <img 
//               src={logo} 
//               alt="Logo" 
//               className="h-8 sm:h-10 w-auto mr-2 sm:mr-4 object-contain"
//             />
//             <span className="text-white font-bold text-lg sm:text-xl">TailorPro</span>
//           </div>

//           {/* Desktop Navigation & Login */}
//           <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
//             {/* Navigation Links */}
//             <div className="flex space-x-8 lg:space-x-16">
//               <button
//                 onClick={() => scrollToSection(aboutUsRef)}
//                 className="text-white hover:text-blue-300 font-medium transition-colors duration-300 text-sm lg:text-base"
//               >
//                 About Us
//               </button>
//               <button
//                 onClick={() => scrollToSection(contactUsRef)}
//                 className="text-white hover:text-blue-300 font-medium transition-colors duration-300 text-sm lg:text-base"
//               >
//                 Contact Us
//               </button>
//             </div>

//             {/* ✅ Single Login Button */}
//             <button
//               onClick={handleLogin}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition flex items-center text-sm sm:text-base"
//             >
//               <FaUser className="mr-2" />
//               Login
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={toggleMobileMenu}
//             className="md:hidden text-white text-xl p-2"
//           >
//             {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu Overlay */}
//         <AnimatePresence>
//           {isMobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 pt-20"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               <motion.div
//                 initial={{ x: '100%' }}
//                 animate={{ x: 0 }}
//                 exit={{ x: '100%' }}
//                 transition={{ type: "tween", duration: 0.3 }}
//                 className="absolute top-0 right-0 h-full w-64 bg-[#001f3f] shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex flex-col p-6 space-y-6 mt-8">
//                   <button
//                     onClick={() => scrollToSection(aboutUsRef)}
//                     className="text-white hover:text-blue-300 font-medium text-lg transition-colors duration-300 text-left py-2"
//                   >
//                     About Us
//                   </button>
//                   <button
//                     onClick={() => scrollToSection(contactUsRef)}
//                     className="text-white hover:text-blue-300 font-medium text-lg transition-colors duration-300 text-left py-2"
//                   >
//                     Contact Us
//                   </button>
//                   <button
//                     onClick={handleLogin}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center mt-4"
//                   >
//                     <FaUser className="mr-2" />
//                     Login
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </header>

//       {/* Hero Section */}
//       <div className="relative h-screen w-full overflow-hidden pt-16">
//         <div className="absolute inset-0">
//           <AnimatePresence>
//             <motion.img
//               key={currentIndex}
//               src={images[currentIndex]}
//               alt="background"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//           </AnimatePresence>
//           <div className="absolute inset-0 bg-black bg-opacity-30" />
//         </div>

//         <div className="relative z-10 flex h-full flex-col justify-center items-start px-4 sm:px-6 md:px-10 lg:px-20 text-white">
//           <motion.h1
//             className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-lg max-w-4xl"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//             Tailor Management System
//           </motion.h1>

//           <motion.p
//             className="max-w-full sm:max-w-lg md:max-w-xl text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 drop-shadow leading-relaxed"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.3 }}
//           >
//             Elevate your tailoring business with seamless order tracking,
//             customer management, and fabric inventory control—all in one smart
//             system.
//           </motion.p>

//           <motion.button
//             onClick={handleGetStarted}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg flex items-center text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.6 }}
//           >
//             Get Started <FaArrowRight className="ml-2" />
//           </motion.button>
//         </div>

//         {/* Slider Indicators */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//           {images.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentIndex(i)}
//               className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
//                 i === currentIndex ? "bg-white scale-125" : "bg-gray-400 hover:bg-gray-300"
//               }`}
//               aria-label={`Go to slide ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Features Section */}
//       <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.h2
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 mb-8 sm:mb-10 lg:mb-12"
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             Why Choose TailorPro?
//           </motion.h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
//             {[
//               {
//                 title: "Customer Management",
//                 desc: "Store all customer data, measurements, and preferences in one place.",
//               },
//               {
//                 title: "Smart Order Tracking",
//                 desc: "Track orders from measurement to delivery with real-time updates.",
//               },
//               {
//                 title: "Fabric Inventory Control",
//                 desc: "Manage your fabric stock efficiently with alerts and usage insights.",
//               },
//             ].map((feature, i) => (
//               <motion.div
//                 key={i}
//                 className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 variants={fadeUp}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 custom={i + 1}
//               >
//                 <div className="bg-blue-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//                   <FaCheckCircle className="text-blue-600 text-2xl sm:text-3xl" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
//                   {feature.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Us Section */}
//       <section ref={aboutUsRef} className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <motion.h2
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 mb-4 sm:mb-6 lg:mb-8"
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             About Us
//           </motion.h2>
//           <motion.p
//             className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             TailorPro was created to modernize tailoring businesses. With smart
//             digital tools, we help tailors focus more on their craft while we
//             handle the business side—orders, fabrics, and customers. Our mission
//             is to simplify your daily tasks and boost your productivity.
//           </motion.p>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="bg-gray-100 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.h2
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700 mb-8 sm:mb-10 lg:mb-12"
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             What Our Clients Say
//           </motion.h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
//             {[1, 2, 3].map((i) => (
//               <motion.div
//                 key={i}
//                 className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
//                 variants={fadeUp}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 custom={i}
//               >
//                 <p className="text-gray-600 italic mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
//                   "TailorPro changed how I run my shop. Tracking orders and
//                   fabrics is so easy now!"
//                 </p>
//                 <div className="flex justify-center text-yellow-400 mb-3 sm:mb-4">
//                   {[...Array(5)].map((_, j) => (
//                     <FaStar key={j} className="w-4 h-4 sm:w-5 sm:h-5 mx-0.5" />
//                   ))}
//                 </div>
//                 <h4 className="font-semibold text-gray-800 text-base sm:text-lg">- Client {i}</h4>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer ref={contactUsRef} className="bg-[#001f3f] text-white border-t border-blue-900">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
//             <motion.div 
//               variants={fadeUp} 
//               initial="hidden" 
//               whileInView="visible"
//               className="text-center md:text-left"
//             >
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-white">About Us</h2>
//               <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
//                 TailorPro is designed to streamline your tailoring business
//                 operations with smart tools to manage customers, orders, and
//                 fabrics efficiently.
//               </p>
//             </motion.div>

//             <motion.div 
//               variants={fadeUp} 
//               initial="hidden" 
//               whileInView="visible" 
//               custom={2}
//               className="text-center md:text-left"
//             >
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-white">Contact Us</h2>
//               <ul className="space-y-3 sm:space-y-4">
//                 <li className="flex items-start justify-center md:justify-start">
//                   <FaPhone className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm sm:text-base lg:text-lg">Call</p>
//                     <p className="text-sm sm:text-base lg:text-lg text-gray-300">(011) 286 7511</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start justify-center md:justify-start">
//                   <FaEnvelope className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm sm:text-base lg:text-lg">Email</p>
//                     <p className="text-sm sm:text-base lg:text-lg text-gray-300">info@tailorsystem.com</p>
//                   </div>
//                 </li>
//               </ul>
//             </motion.div>

//             <motion.div 
//               variants={fadeUp} 
//               initial="hidden" 
//               whileInView="visible" 
//               custom={3}
//               className="text-center md:text-left"
//             >
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-white">Business Hours</h2>
//               <ul className="space-y-3 sm:space-y-4">
//                 <li className="flex items-start justify-center md:justify-start">
//                   <FaClock className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm sm:text-base lg:text-lg">Mon-Fri</p>
//                     <p className="text-sm sm:text-base lg:text-lg text-gray-300">9:00 AM - 6:00 PM</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start justify-center md:justify-start">
//                   <FaClock className="mt-1 mr-3 text-blue-300 flex-shrink-0" />
//                   <div>
//                     <p className="font-semibold text-sm sm:text-base lg:text-lg">Saturday</p>
//                     <p className="text-sm sm:text-base lg:text-lg text-gray-300">9:00 AM - 2:00 PM</p>
//                   </div>
//                 </li>
//               </ul>
//             </motion.div>
//           </div>

//           {/* Social Links */}
//           <div className="flex justify-center space-x-6 sm:space-x-8 mb-6 sm:mb-8">
//             <a href="#" className="text-2xl sm:text-3xl text-white hover:text-blue-300 transition-transform duration-300 transform hover:scale-110">
//               <FaFacebook />
//             </a>
//             <a href="#" className="text-2xl sm:text-3xl text-white hover:text-blue-300 transition-transform duration-300 transform hover:scale-110">
//               <FaInstagram />
//             </a>
//             <a href="#" className="text-2xl sm:text-3xl text-white hover:text-blue-300 transition-transform duration-300 transform hover:scale-110">
//               <FaTwitter />
//             </a>
//           </div>

//           <div className="border-t border-blue-800 pt-4 sm:pt-6 text-center">
//             <p className="text-xs sm:text-sm lg:text-base text-gray-300">
//               © {currentYear} Tailor Management System. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Landing;