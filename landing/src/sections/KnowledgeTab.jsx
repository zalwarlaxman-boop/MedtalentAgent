import { useState } from 'react';
import { Card, Button } from "../components/UI";

export function KnowledgeTab() {
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const runSearchDemo = async () => {
    setIsSearching(true);
    setShowResult(false);
    await new Promise(r => setTimeout(r, 1500));
    setIsSearching(false);
    setShowResult(true);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden text-center pt-24 pb-20 px-10 border-b border-black/5 mb-5 bg-gradient-to-b from-bg-secondary to-bg-color">
        <h2 className="text-[24px] font-semibold text-primary mb-4">Knowledge Engine</h2>
        <h1 className="font-title text-[56px] font-bold leading-[1.1] tracking-[-1px] mb-6 bg-gradient-to-br from-[#1A1D20] to-[#4A5568] bg-clip-text text-transparent">
          智能健康知识引擎
        </h1>
        <p className="text-[20px] text-text-secondary max-w-[700px] mx-auto mb-8 leading-relaxed">
          收录超 5000 万条权威医学数据 · RAG 检索增强
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-10">
        <div className="bg-bg-secondary rounded-[24px] p-10 md:p-20 text-center my-16 relative overflow-hidden">
          <div className="absolute top-6 left-6 bg-primary/10 text-primary-dark px-4 py-1.5 rounded-full text-[13px] font-semibold">Knowledge Search</div>
          <h3 className="font-title text-[32px] font-bold text-text-main mb-4 mt-6 flex items-center justify-center gap-3 tracking-[-0.5px]">📚 RAG 循证医学知识检索</h3>
          <p className="text-[18px] text-text-secondary mb-12 max-w-[600px] mx-auto">模拟在海量知识库中进行大模型语义检索，提供可溯源的权威医学结论。</p>

          <div className="max-w-[800px] mx-auto bg-white border border-black/5 rounded-[24px] shadow-float overflow-hidden flex flex-col md:flex-row items-center mb-10 transition-all duration-300 focus-within:shadow-float-hover focus-within:border-primary/30">
            <input
              type="text"
              value="二甲双胍的主要禁忌症有哪些？"
              readOnly
              className="w-full bg-transparent border-none text-[18px] p-6 outline-none text-text-main"
            />
            <button
              onClick={runSearchDemo}
              disabled={isSearching}
              className="w-full md:w-auto h-[70px] bg-gradient-to-r from-primary to-primary-dark text-white px-10 text-[18px] font-semibold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSearching ? '检索中...' : '智能检索'}
            </button>
          </div>

          {showResult && (
            <div className="text-left max-w-[800px] mx-auto bg-white border border-primary-light rounded-[24px] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-2 mb-6 flex-wrap">
                <span className="bg-primary-light text-primary-dark px-3 py-1 rounded-md text-[13px] font-medium">UpToDate 循证数据库</span>
                <span className="bg-primary-light text-primary-dark px-3 py-1 rounded-md text-[13px] font-medium">2025版糖尿病用药指南</span>
                <span className="bg-[#e8f5e9] text-[#00C853] px-3 py-1 rounded-md text-[13px] font-medium">知识图谱关联度: 98%</span>
              </div>
              <p className="text-[17px] text-text-main font-semibold mb-4">【二甲双胍】的主要禁忌症结构化提取如下：</p>
              <ul className="list-disc pl-6 space-y-3 text-[16px] text-text-secondary leading-relaxed mb-6">
                <li><strong>严重肾功能不全：</strong>eGFR {'<'} 30 mL/min/1.73m² 绝对禁用。</li>
                <li><strong>组织缺氧相关疾病：</strong>如失代偿期心力衰竭、呼吸衰竭、近期急性心肌梗死。</li>
                <li><strong>急性代谢性疾病：</strong>如糖尿病酮症酸中毒（DKA）。</li>
                <li><strong>造影剂冲突：</strong>静脉注射碘造影剂前或当时应停用。</li>
              </ul>
              <div className="p-4 bg-[#fff5f5] border-l-4 border-[#F53F3F] rounded-r-lg text-[14px] text-text-secondary">
                <strong className="text-[#F53F3F]">⚠️ AI 合规提示：</strong>以上信息仅供专业医疗人员决策参考，不可直接替代临床面诊。
              </div>
            </div>
          )}
        </div>

        <div className="mb-20 text-center">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">智能健康知识引擎</h2>
          <p className="text-[17px] text-text-secondary leading-[1.8] max-w-[900px] mx-auto mb-6">
            收录超 5000 万条权威医学数据，基于大模型与知识图谱技术，为健康专业人士提供精准、权威、实时的专业知识检索与辅助决策支持。
          </p>
          <p className="text-[17px] text-text-secondary leading-[1.8] max-w-[900px] mx-auto mb-6">
            <strong>浙江省健康科普专家库分库</strong> 2351名主任级专家知识底座
          </p>
          <p className="text-[17px] text-text-main font-bold max-w-[900px] mx-auto mb-6">浙里健康24个专业分库：</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-[1000px] mx-auto">
            {[
              "老年健康科普分库", "眼底健康科普分库", "头颈甲状腺外科科普分库",
              "结核病防治科普分库", "艾滋病防治科普分库", "免疫规划科普分库",
              "口腔保健科普分库", "中医保健科普专家", "慢病(体)理科普分库",
              "乳腺外科科普分库", "控烟科普分库", "近视防控科普分库",
              "心理健康科普分库", "肿瘤防治科普分库", "妇女保健科科普分库",
              "儿童保健科普分库", "心血管科普分库", "颈肩腰腿病保健科普分库",
              "肿瘤与营养科普分库", "骨科健康科普分库", "皮肤病与医学美容科普分库",
              "呼吸健康分库", "护理科普分库"
            ].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white border border-black/5 rounded-full text-[14px] text-text-main font-medium shadow-sm hover:bg-primary-light hover:text-primary-dark transition-colors">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px] text-text-main">核心知识模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">临床指南</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-2">• 覆盖 2500+ 权威机构发布的最新临床诊疗指南与专家共识</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• 支持目录浏览，快速定位对应诊疗规范</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">药品百科</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-2">• 涵盖 15000+ 处方药、OTC 及中成药的详细说明书与相互作用说明</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• 提供目录浏览，方便查询药品信息</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">医学知识图谱</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-2">• 包含 8000+ 基于知识图谱构建的疾病关联分析与病理机制内容</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• 支持目录浏览，直观理解疾病间的逻辑关系</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">健康检测</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed mb-2">• 覆盖 3000+ 各类医学检验项目解读、正常值范围及临床意义</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">• 提供目录浏览，助力快速解读检验报告</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px] text-text-main">核心能力</h2>
          <div className="max-w-[900px] mx-auto space-y-6">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">RAG 检索增强</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">结合大模型语义理解与精准检索，输出精准、可溯源的知识问答，避免信息偏差。</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">循证医学支持</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">所有内容均标注权威来源（如 UpToDate、PubMed），确保医疗信息的可信度与专业性。</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">实时动态更新</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">自动追踪全球顶级医学期刊与卫生公告，持续更新知识库，保障知识时效性。</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">多模态解析</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">支持医学影像（CT/MRI）、病理切片及心电图等多模态数据检索，满足复杂临床场景需求。</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">最新收录动态</h2>
          <div className="max-w-[900px] mx-auto space-y-4">
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4"><span className="text-text-light mr-4">2026-02-26</span>指南：2026年高血压防治指南更新解读</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4"><span className="text-text-light mr-4">2026-02-24</span>药物：新型GLP-1受体激动剂临床应用专家共识</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4"><span className="text-text-light mr-4">2026-02-20</span>技术：人工智能在肺结节早期筛查中的应用规范</div>
            <div className="text-[16px] text-text-main border-b border-black/5 pb-4"><span className="text-text-light mr-4">2026-02-15</span>政策：关于印发《国家基本药物目录（2025年版）》的通知</div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">开放能力与服务</h2>
          <div className="max-w-[900px] mx-auto space-y-8">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">知识库 API 接入</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">提供标准 RESTful API，支持企业级私有化部署，可快速集成至现有医疗系统。</p>
            </Card>
            <div className="text-center mt-10">
              <h3 className="text-[24px] text-primary mb-4 font-bold">数据合作</h3>
              <p className="text-[17px] text-text-secondary">我们诚邀医疗机构、科研院所及出版集团开展数据共建与知识共享。</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
