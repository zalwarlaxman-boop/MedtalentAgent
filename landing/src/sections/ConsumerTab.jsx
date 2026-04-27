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
          <div className="absolute top-6 left-6 bg-white text-primary-dark px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide shadow-sm">
            System Entry
          </div>
          <h3 className="font-title text-[40px] font-bold text-text-main mb-4 flex items-center justify-center gap-3 tracking-[-0.5px]">
            大众端健康平台
          </h3>
          <p className="text-[18px] text-text-secondary mb-10 max-w-[600px] mx-auto">
            进入真实的浙里健康前端应用，体验基于多模态大模型的生活方式医学智能体平台。
          </p>
          <a href="/wutong/" className="inline-block">
            <Button>进入大众端平台系统</Button>
          </a>
        </div>

        {/* Stats */}
        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-10 tracking-[-0.5px] text-text-main">核心信任数据</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { num: "X万+", label: "注册用户" },
              { num: "2351名", label: "主任级合作名医" },
              { num: "24大", label: "垂直健康场景" },
              { num: "X%", label: "用户满意度" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-bg-secondary rounded-2xl border border-black/[0.02]">
                <div className="text-[40px] font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 font-title tracking-tight">{stat.num}</div>
                <div className="text-[15px] font-medium text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center max-w-[1000px] mx-auto mb-10">
            <p className="text-[17px] text-text-main font-bold mb-4">官方专家库硬核背书 + 顶级名医资源壁垒 + 全维度专业分库，构筑业内不可复制的核心竞争力</p>
            <p className="text-[17px] text-text-secondary leading-[1.8]">平台彻底摒弃普通健康类平台内容非专业、无权威背书的行业通病，深度联动官方健康体系与国内一线顶级医疗资源，独家搭建业内标杆级权威专业底座。全平台智能体服务、健康科普、干预方案均严格基于循证医学体系与主任级名医临床实践经验，全方位保障内容专业性、合规性与临床指导性，筑牢行业竞争护城河，拉开与同类产品的核心差距。</p>
          </div>

          <div className="space-y-6 max-w-[1000px] mx-auto">
            <Card className="p-8">
              <h3 className="text-[#00C853] text-[20px] font-semibold mb-3 flex items-center gap-2">官方权威资质：浙江省健康科普专家库分库</h3>
              <p className="text-[16px] text-text-secondary leading-relaxed">依托官方健康科普体系独家授权，成为拥有官方专家库资质的生活方式医学专业平台，所有内容输出全程贴合国家健康科普规范，合规性拉满，自带官方公信力背书，品牌可信度与行业地位远超同类竞品。</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[#00C853] text-[20px] font-semibold mb-3 flex items-center gap-2">顶级名医壁垒：2351位主任级名医知识底座，未来打通2351个医生智能体</h3>
              <p className="text-[16px] text-text-secondary leading-relaxed">已完成与浙江省2351名主任级名医的科普知识、临床经验授权合作，全面打通顶级医疗资源与AI智能技术，将名医的生活方式干预理念、慢病调理方案、日常健康养护经验数字化、智能化，让普通百姓无需排队、不限地域、低成本获取名医级健康指导，真正实现优质医疗资源全民普惠。</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[#00C853] text-[20px] font-semibold mb-3 flex items-center gap-2">全场景专业覆盖：24个科普专业分库，打造24个专项智能体矩阵</h3>
              <p className="text-[16px] text-text-secondary leading-relaxed">围绕生活方式医学全场景大众需求，依托循证医学知识与名医独家资源，搭建24个垂直领域专业分库，覆盖慢病管理、抗衰延寿、体重管控、睡眠改善、孕产养护、肠道健康、免疫提升等全品类健康场景，对应落地24个垂直专项智能体，相较于行业基础10大场景，实现健康需求全覆盖、人群痛点全响应，服务颗粒度更精细、用户适配性更强。</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">顶层开发逻辑 · 功能架构</h2>
          <div className="max-w-[1000px] mx-auto">
            <p className="text-[17px] text-text-secondary leading-[1.8] mb-8">平台以生活方式医学智能体为核心中枢，向下延伸构建标准化功能版块，同时辐射N个垂直细分专项智能体，全矩阵共享统一底层共用基座，实现“底层同源、前端分场、全域获客、统一留存变现”的闭环开发逻辑。</p>
            <h3 className="text-[20px] text-primary font-bold mb-4">一、功能逻辑：核心功能架构</h3>
            <p className="text-[17px] text-text-secondary leading-[1.8] mb-4">作为全域流量承接、用户沉淀、精准导流的核心枢纽，承载六大核心功能版块，打通服务与商业全链路：</p>
            <ul className="text-[16px] text-text-secondary leading-[1.8] list-disc list-inside space-y-3">
              <li><strong>功能版块1：自然对话交互（用户核心入口层）：</strong>支持大众自然语言多模态互动，零门槛获取健康信息，摒弃专业壁垒，适配全民使用习惯；</li>
              <li><strong>功能版块2：健康画像识别（数据核心支撑层）：</strong>自动录入、归类用户健康数据，构建专属动态健康画像，精准识别用户需求与健康痛点；</li>
              <li><strong>功能版块3：动态跟踪管理（服务核心交付层）：</strong>基于健康画像实时跟踪、智能匹配方案，全程陪伴式管理，主动推送提醒与干预建议；</li>
              <li><strong>功能版块4：定制健康套餐（标准化服务层）：</strong>针对不同人群需求，输出个性化、可落地的生活方式健康套餐，兼顾专业性与实用性；</li>
              <li><strong>功能版块5：严选健康好物（商业变现核心层）：</strong>依托合规供应链，推送适配的健康产品与服务，打造合规变现通道；</li>
              <li><strong>功能版块6：名医专家科普（专业价值赋能层）：</strong>链接2351名主任级名医，提供权威科普内容与专业指导，强化平台专业价值</li>
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">全智能体共享：AI底层共用基座</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10 max-w-[900px] mx-auto">统一权威技术底座，保障全矩阵智能体专业合规、高效运行，六大核心支撑：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">权威循证知识库</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">循证医学+名医知识双支撑，内容专业可追溯</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">自研AI智能引擎</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">自有人工智能技术驱动，实现自然交互、智能匹配、动态推理</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">动态健康画像系统</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">向量数据库支撑，数据互通，无需重复建档</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">通用能力池</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">对话、打卡、提醒、数据导入等通用能力全矩阵共享</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">供应链+支付闭环</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">自有+医院合作供应链+商业保险支付，打通商业闭环</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">全链路安全合规</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">数据脱敏、加密传输，符合健康数据监管要求</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">核心价值</h2>
          <div className="max-w-[900px] mx-auto">
            <ul className="text-[16px] text-text-secondary leading-[1.8] space-y-4">
              <li className="flex gap-2"><span>•</span> <span><strong>核心价值：</strong>全科健康初筛、基础生活调理、慢病预防、健康知识普及，聚焦非严肃、非问诊类大众健康管理</span></li>
              <li className="flex gap-2"><span>•</span> <span><strong>目标用户：</strong>全年龄段健康关注者、亚健康人群、慢病高危人群、全民大众百姓</span></li>
              <li className="flex gap-2"><span>•</span> <span><strong>核心功能：</strong>自然语言健康咨询、一键生成健康画像、基础健康方案、科普打卡、好物推荐、名医链接</span></li>
              <li className="flex gap-2"><span>•</span> <span><strong>战略作用：</strong>承接全域流量，沉淀核心用户，精准导流至专项智能体，实现流量精细化运营</span></li>
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-6 tracking-[-0.5px] text-text-main">1+N生活方式医学AI智能体矩阵</h2>
          <p className="text-[17px] text-text-secondary text-center mb-10 max-w-[900px] mx-auto">
            N个垂直细分专项智能体矩阵<br/>
            聚焦大众细分健康痛点，打造24大垂直场景专项智能体，核心场景精准落地，覆盖全人群全周期健康需求
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">长寿屋智能体「抗衰/延寿管理」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对中高龄、抗衰需求人群，提供寿命评估、衰老指标管理、慢病共管、定制抗衰方案</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">男性活力智能体「机能/精力管理」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对成年男性，提供精力养护、机能调理、生活方式干预、日常提醒服务</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">体重管理智能体「减脂/塑形管控」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对减脂塑形人群，提供热量平衡管理、食谱运动计划、体重动态跟踪</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">安睡阁智能体「睡眠质量改善」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对失眠作息紊乱人群，提供睡眠节律调整、助眠方案、睡眠跟踪</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">减压馆智能体「情绪/压力管理」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对高压职场人群，提供情绪调节、压力疏导、放松任务打卡</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">慢病管理智能体「三高/代谢病养护」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对慢病人群，提供指标跟踪、生活干预、禁忌预警、复诊提醒</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">孕养轩智能体「备孕/孕中/产后养护」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对孕产女性，提供全周期方案、产检提醒、产后修复指导</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">免疫提升智能体「亚健康/疲劳改善」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对亚健康易疲劳人群，提供免疫提升计划、疲劳监测、感染预防</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">肠道健康智能体「消化/菌群调理」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对肠胃不适人群，提供菌群调理、饮食方案、排便跟踪</p>
            </Card>
            <Card className="p-8 border-l-[4px] border-primary">
              <h3 className="text-[20px] font-semibold text-text-main mb-3">美颜内调智能体「肌肤/好气色管理」</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">针对爱美人群，提供内调外养双方案、肌肤状态管理、养颜指导</p>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">统一运营 · 完整商业闭环</h2>
          <div className="max-w-[900px] mx-auto">
            <p className="text-[17px] text-text-secondary leading-[1.8] mb-6 text-center">构建流量-留存-变现-迭代的可持续增长闭环，商业模型清晰，盈利空间可观</p>
            <ul className="text-[16px] text-text-secondary leading-[1.8] list-disc list-inside space-y-4">
              <li><strong>1 流量入口：双轨获客，全域覆盖：</strong>母体智能体全域导流+专项智能体独立获客，精准触达细分人群，降低获客成本</li>
              <li><strong>2 用户留存：数据绑定，长期粘性：</strong>统一健康画像+多智能体数据同步+打卡积分体系，提升用户复购与长期留存</li>
              <li><strong>3 多元变现：四大链路，盈利清晰：</strong>健康好物佣金、会员订阅、个性化定制服务、专家服务分成，叠加保险支付支持</li>
              <li><strong>4 数据反哺：正向循环，持续优化：</strong>脱敏用户数据沉淀底层，持续迭代AI模型与知识库，提升服务精度</li>
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-title text-[32px] font-bold text-center mb-8 tracking-[-0.5px] text-text-main">技术架构 & 安全保障 · 硬核技术底座</h2>
          <div className="max-w-[1000px] mx-auto">
            <p className="text-[18px] text-text-main font-bold mb-4">全栈分层技术架构</p>
            <ul className="text-[16px] text-text-secondary leading-[1.8] list-disc list-inside space-y-2 mb-10">
              <li>接入层：适配小程序/公众号/APP/官网多端，全场景覆盖，多端同步</li>
              <li>应用层：C端用户门户+专项智能体服务+运营后台，模块化可快速扩展</li>
              <li>智能层：知识推理+动态知识图谱+自研大模型调度+个性化适配</li>
              <li>数据层：脱敏健康档案+通用/专项知识库，分层隔离存储，安全可控</li>
              <li>基础设施：云原生弹性扩容，异地多活架构，保障高并发稳定运行</li>
            </ul>

            <p className="text-[18px] text-text-main font-bold mb-6 text-center">银行级数据安全与合规保障</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: "99.99%", label: "服务可用性" },
                { num: "<50ms", label: "平均响应延迟" },
                { num: "三级等保", label: "合规认证" },
                { num: "全链路脱敏", label: "隐私保护" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-bg-secondary rounded-2xl border border-black/[0.02]">
                  <div className="text-[28px] font-bold bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent mb-2 font-title tracking-tight">{stat.num}</div>
                  <div className="text-[14px] font-medium text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
