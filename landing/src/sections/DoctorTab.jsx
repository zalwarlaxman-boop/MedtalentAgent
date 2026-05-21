import { Card, Button } from "../components/UI";

export function DoctorTab() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden text-center pt-20 pb-8 px-10 border-b border-black/5 mb-0 bg-gradient-to-b from-bg-secondary to-bg-color">
        <h2 className="text-[24px] font-semibold text-[#00C853] mb-4">Doctor Workflow</h2>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 bg-gradient-to-br from-[#00C853] to-[#009624] bg-clip-text text-transparent">
          医生端定制开发
        </h1>
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-4 leading-relaxed">
          门诊效率提升 · 智能病历生成 · 专科模型训练微调
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 pt-0 pb-10">
        <p className="text-[18px] text-center max-w-[800px] mx-auto mb-6 mt-4 text-text-secondary">
          为医生群体提供强大的效率工具，支持专病数据集本地化部署，通过定制专属工作流极大地减少案头工作时间。
        </p>

        {/* Demo Entry */}
        <div className="bg-gradient-to-br from-bg-secondary to-[#e8f5e9] rounded-[32px] p-[50px_40px] text-center mb-20 relative overflow-hidden">
          <div className="absolute top-6 left-6 bg-white text-[#009624] px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide">
            System Entry
          </div>
          <h3 className="font-title text-[40px] font-bold text-text-main mb-4 flex items-center justify-center gap-3 tracking-[-0.5px]">
            医生端定制服务
          </h3>
          <p className="text-[18px] text-text-secondary mb-10 max-w-[600px] mx-auto">
            进入真实的医生端应用，体验语音口述生成病历、智能预问诊与自动辅助诊断。
          </p>
          <a href="/demo/" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button variant="doctor">进入医生端系统</Button>
          </a>
        </div>

        <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px]">核心能力体系</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "AI Agent引擎", desc: "100+专业AI Agent智能编排，覆盖L1-L5五级体系。" },
            { title: "智能数据辅助", desc: "基于医学知识库的智能数据建议，提升催工效率。" },
            { title: "医疗级风控", desc: "双重安全审核机制，确保医疗内容合规安全。" },
            { title: "多租户层级", desc: "支持超级管理员、机构管理员、医生、患者多级角色。" },
            { title: "全周期管理", desc: "从预防到康复的全生命周期健康管理。" },
            { title: "患者记忆系统", desc: "向患者数据库存储患者历史，提供个性化服务。" }
          ].map((feature, i) => (
            <Card key={i} className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">{feature.title}</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}