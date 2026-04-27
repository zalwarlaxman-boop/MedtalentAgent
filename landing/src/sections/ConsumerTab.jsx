import { Card, Button } from "../components/UI";

export function ConsumerTab() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden text-center pt-24 pb-20 px-10 border-b border-black/5 mb-5 bg-gradient-to-b from-bg-secondary to-bg-color">
        <h2 className="text-[24px] font-semibold text-primary mb-4">Consumer Platform</h2>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 bg-gradient-to-br from-[#1A1D20] to-[#4A5568] bg-clip-text text-transparent">
          浙里健康 - 大众端平台
        </h1>
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-8 leading-relaxed">
          主动预防 · 智能陪伴 · 触手可及的全周期健康管理服务
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-10">
        <p className="text-[18px] text-center max-w-[800px] mx-auto mb-16 text-text-secondary">
          为普通群众提供7x24小时的在线健康管家，涵盖体检报告解读、慢病日常管理、营养运动处方定制等核心场景。
        </p>

        {/* Demo Entry */}
        <div className="bg-gradient-to-br from-bg-secondary to-[#e6f7ff] rounded-[32px] p-[80px_40px] text-center mb-20 relative overflow-hidden">
          <div className="absolute top-6 left-6 bg-white text-primary-dark px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide">
            System Entry
          </div>
          <h3 className="font-title text-[40px] font-bold text-text-main mb-4 flex items-center justify-center gap-3 tracking-[-0.5px]">
            🎯 大众端健康平台
          </h3>
          <p className="text-[18px] text-text-secondary mb-10 max-w-[600px] mx-auto">
            进入真实的浙里健康前端应用，体验基于多模态大模型的生活方式医学智能体平台。
          </p>
          <a href="/wutong/" className="inline-block">
            <Button>🚀 进入大众端平台系统</Button>
          </a>
        </div>

        {/* Stats */}
        <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px]">核心信任数据</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { num: "X万+", label: "注册用户" },
            { num: "2351名", label: "主任级合作名医" },
            { num: "24大", label: "垂直健康场景" },
            { num: "X%", label: "用户满意度" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 bg-bg-secondary rounded-2xl border border-black/[0.02]">
              <div className="text-[40px] font-bold gradient-text mb-2 font-title tracking-tight">{stat.num}</div>
              <div className="text-[15px] font-medium text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <h3 className="text-[#00C853] text-[20px] font-semibold mb-3 flex items-center gap-2">✅ 官方权威资质：浙江省健康科普专家库分库</h3>
            <p className="text-text-secondary leading-relaxed">依托官方健康科普体系独家授权，成为拥有官方专家库资质的生活方式医学专业平台，所有内容输出全程贴合国家健康科普规范，合规性拉满，自带官方公信力背书，品牌可信度与行业地位远超同类竞品。</p>
          </Card>
          <Card className="p-8">
            <h3 className="text-[#00C853] text-[20px] font-semibold mb-3 flex items-center gap-2">✅ 顶级名医壁垒：2351位主任级名医知识底座</h3>
            <p className="text-text-secondary leading-relaxed">已完成与浙江省2351名主任级名医的科普知识、临床经验授权合作，全面打通顶级医疗资源与AI智能技术，将名医的生活方式干预理念、慢病调理方案、日常健康养护经验数字化、智能化，让普通百姓无需排队、不限地域、低成本获取名医级健康指导，真正实现优质医疗资源全民普惠。</p>
          </Card>
        </div>
      </div>
    </div>
  );
}