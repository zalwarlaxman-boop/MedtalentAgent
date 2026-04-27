import { Button, Card } from "../components/UI";
import { motion } from "framer-motion";

export function HomeTab({ onNavigate }) {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative overflow-hidden text-center pt-24 pb-20 px-10 border-b border-black/5 mb-5 bg-gradient-to-b from-bg-secondary to-bg-color">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,198,255,0.15)_0%,transparent_70%)] pointer-events-none z-0" />
        
        <img 
          src="/无文字logo.png" 
          alt="Medtalent Agent" 
          className="max-h-20 mx-auto mb-6 relative z-10 drop-shadow-[0_8px_16px_rgba(0,198,255,0.3)]" 
        />
        
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 relative z-10 bg-gradient-to-br from-[#1A1D20] to-[#4A5568] bg-clip-text text-transparent">
          智能体矩阵生态
        </h1>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 relative z-10 gradient-text mt-2">
          有了病，不担心；少生病，更健康
        </h1>
        
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-8 leading-relaxed relative z-10">
          全新一代生活方式医学 AI-AGENT 底座开发<br/>助力医学科普产业化，重塑健康未来
        </p>
        
        <div className="flex gap-4 justify-center relative z-10 mt-10">
          <Button onClick={() => onNavigate('overview')}>
            探索 1+N 计划
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('consumer')}>
            体验系统
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-10 text-center py-20">
        <p className="text-[24px] text-text-main mb-16 max-w-[800px] mx-auto leading-relaxed">
          我们坚信，这是一个值得全力以赴的伟大创业项目，<br/>坚持以服务群众为初心，让优质健康服务触手可及。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="p-10">
            <h3 className="text-[22px] text-text-main mb-4 flex items-center gap-3 font-semibold">
              前沿科技浪尖
            </h3>
            <p className="text-[17px] text-text-secondary leading-relaxed">
              在人工智能浪潮汹涌袭来的时刻，我们通过技术创新助力医学科普产业化高质量推进。
            </p>
          </Card>
          <Card className="p-10">
            <h3 className="text-[22px] text-text-main mb-4 flex items-center gap-3 font-semibold">
              医患高效链接
            </h3>
            <p className="text-[17px] text-text-secondary leading-relaxed">
              助力医生搭建智能体体系，高效链接广大群众，让百姓轻松获得全周期健康管理服务。
            </p>
          </Card>
        </div>

        <p className="text-[20px] font-medium gradient-text mt-20 leading-[1.8] max-w-[900px] mx-auto">
          推动全民健康理念升级：从被动治疗走向主动健康，从病后管理走向事先预防，全方位助力中国老百姓提升健康认知，守护全民健康！
        </p>
      </div>
    </div>
  );
}