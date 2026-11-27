import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Header() {
  const location = useLocation();
  const [isWorkHovered, setIsWorkHovered] = useState(false);

  const workCategories = [
    { name: "PRODUCT CASE STUDIES", id: "product-cases" },
    { name: "RESEARCH", id: "research" },
    { name: "PRACTICE", id: "practice" },
    { name: "IP CULTURE", id: "ip-culture" },
    { name: "PHOTOGRAPHY", id: "photography" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F2F2F2]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-[1440px]">
        <Link to="/" className="text-[1rem] sm:text-[1.2rem] font-medium tracking-[0.15em] sm:tracking-[0.2em] text-[#1A1A1A] whitespace-nowrap">
          LING DESIGN
        </Link>

        <nav className="flex items-center space-x-4 sm:space-x-8 md:space-x-12">
          {/* WORK with Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsWorkHovered(true)}
            onMouseLeave={() => setIsWorkHovered(false)}
          >
            <Link
              to="/"
              className={`flex items-center gap-1 text-[0.75rem] sm:text-[0.85rem] tracking-widest transition-opacity hover:opacity-70 ${
                location.pathname === "/" ? "font-semibold" : "text-[#666]"
              }`}
            >
              WORK
              <ChevronDown size={12} className={`transition-transform duration-300 ${isWorkHovered ? 'rotate-180' : ''}`} />
            </Link>

            <AnimatePresence>
              {isWorkHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full -left-4 pt-4"
                >
                  <div className="bg-white border border-[#F2F2F2] shadow-sm py-4 w-48 rounded-lg overflow-hidden">
                    {workCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/#${cat.id}`}
                        onClick={(e) => {
                          // 已在首页时直接滚动，避免 hash 导航造成闪动
                          if (location.pathname === "/") {
                            e.preventDefault();
                            const el = document.getElementById(cat.id);
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }
                          setIsWorkHovered(false);
                        }}
                        className="block px-6 py-3 text-[0.75rem] tracking-widest text-[#666] hover:text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors uppercase"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/about"
            className={`text-[0.75rem] sm:text-[0.85rem] tracking-widest transition-opacity hover:opacity-70 ${
              location.pathname === "/about" ? "font-semibold" : "text-[#666]"
            }`}
          >
            ABOUT
          </Link>
          <Link
            to="/contact"
            className={`text-[0.75rem] sm:text-[0.85rem] tracking-widest transition-opacity hover:opacity-70 ${
              location.pathname === "/contact" ? "font-semibold" : "text-[#666]"
            }`}
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}
