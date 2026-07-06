import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { localImages } from "./imageAssets";

export function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-1/2"
          >
            <div className="aspect-[3/4] rounded-[12px] overflow-hidden bg-[#F2F2F2]">
              <ImageWithFallback
                src={localImages.profileImage}
                alt="Profile"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 space-y-12"
          >
            <div>
              <h1 className="text-[2.5rem] font-medium tracking-[0.2em] mb-8 text-[#1A1A1A]">MeiLing</h1>
              <div className="space-y-6 text-[#666] leading-relaxed text-[1.1rem]">
                <p>城市空间设计背景。关注空间、产品与文化之间的系统关系，用产品思维重新理解设计问题的组织方式。</p>
                <p>在系列实践中，将建筑与空间视为一种可被迭代的体验系统，而不仅是形式与功能的终端输出。通过引入用户体验、服务逻辑与内容结构的方法，使设计能够在不同场景中持续运行与扩展。</p>
                <p>项目实践横跨城市空间、文化IP与数字体验系统，从单一的空间设计到整体性的“系统设计”——空间如何支持行为，内容如何形成传播，体验如何转化为长期价值。</p>
                <p>设计的本质不仅是塑造空间，更是构建连接人、内容与环境的结构系统。</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-[#F2F2F2]">
              <div className="space-y-4">
                <h3 className="text-[0.8rem] tracking-widest text-[#1A1A1A] font-bold uppercase">教育经历</h3>
                <ul className="text-[0.9rem] text-[#777] space-y-2">
                  <li>湖南科技大学 城乡规划 本科</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[0.8rem] tracking-widest text-[#1A1A1A] font-bold uppercase">获奖荣誉</h3>
                <ul className="text-[0.9rem] text-[#777] space-y-2">
                  <li>2018 “园冶杯”  荣誉奖</li>
                  <li>2018 全国绿色建筑设计竞赛 三等奖</li>
                  <li>2022 浙江省“千万工程”未来乡村 优秀案例</li>
                  <li>2017-2018 国家励志奖学金、校一等奖学金、优秀团员等</li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/"
                className="inline-block px-12 py-4 border border-[#1A1A1A] text-[0.8rem] tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all uppercase"
              >
                返回首页 / BACK TO HOME
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
