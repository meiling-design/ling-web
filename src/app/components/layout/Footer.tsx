import { Link } from "react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white py-20">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/10 pb-16">
          <div className="space-y-6">
            <h2 className="text-[1.5rem] tracking-[0.2em] font-medium">LING DESIGN</h2>
            <p className="text-[#777] max-w-sm text-[0.9rem] leading-relaxed">
              探索空间、时间与叙事的交汇点。致力于建筑、摄影与产品的纯粹表达。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div className="space-y-4">
              <h3 className="text-[0.75rem] tracking-widest text-[#777] uppercase font-bold">导航</h3>
              <ul className="space-y-2 text-[0.9rem]">
                <li><Link to="/" className="hover:text-gray-400 transition-colors">作品集 / WORK</Link></li>
                <li><Link to="/about" className="hover:text-gray-400 transition-colors">关于 / ABOUT</Link></li>
                <li><Link to="/contact" className="hover:text-gray-400 transition-colors">联系 / CONTACT</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-[0.75rem] tracking-widest text-[#777] uppercase font-bold">联系</h3>
              <ul className="space-y-2 text-[0.9rem]">
                <li><Link to="/contact" className="hover:text-gray-400 transition-colors">邮箱 / ling@design.com</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.8rem] text-[#777]">
          <p>© {currentYear} LING DESIGN. ALL RIGHTS RESERVED.</p>
          <p>CHINA</p>
        </div>
      </div>
    </footer>
  );
}
