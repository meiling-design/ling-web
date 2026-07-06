import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./Home";
import { About } from "./About";
import { Contact } from "./Contact";
import { ProjectDetail } from "./ProjectDetail";
import { motion, useScroll, useSpring } from "motion/react";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

function Root() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] selection:bg-[#F2F2F2] selection:text-[#1A1A1A] lg:min-w-[1600px] lg:overflow-x-auto">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#1A1A1A] origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <Header />
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

// Update the routes config to use this Root layout
export { Root };
