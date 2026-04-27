import React from 'react';

export default function TabOverview() {
  return (
    <div className="tab-content active">
      <div className="hero">
        <h1>Medtalent Agent - 1+N-PLAN</h1>
        <h2 style={{ fontSize: '26px', fontWeight: 'normal', opacity: 0.95, marginBottom: '10px' }}>AI智能体矩阵</h2>
        <p>聚焦“AI+生活医学”核心赛道 · 技术赋能 + 商业变现双闭环</p>
      </div>

      <div className="section">
        <h2 className="section-title">平台定位</h2>
        <p className="text">
          聚焦“AI+生活医学”核心赛道，以自研Medtalent Agent底座为核心，推出“1+N”计划。打造“1个通用基座+N个垂直智能体+N个专家智能体”。通过人工智能技术与权威医学知识的联动，覆盖服务C端大众、B端医生（包括医疗机构），实现“技术赋能+商业变现”双闭环，打造不可复制的行业竞争力。
        </p>

        <h2 style={{ textAlign: 'center', fontSize: '30px', color: 'var(--primary)', margin: '40px 0' }}>木吾木同</h2>
        <p className="text" style={{ textAlign: 'center' }}>
          全新一代生活方式医学AI-AGENT底座开发<br />
          助力医学科普产业化｜助力医生建设医生智能体｜助力百姓触手可及健康管理｜重塑健康未来
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">智能体Agent集群底座</h2>
        <ul className="text" style={{ paddingLeft: '30px' }}>
          <li>融合100+基于权威医学知识库的专业智能体，以循证数据为基础，驱动“数据支持+运营管理”双效合一，构建智慧健康管理新模式。</li>
          <li>联结2351多名主任级医生专家知识底座</li>
          <li>自有开发Medtalent agent方法论，融合ocr、rag、孪生、大模型等技术，打造覆盖L1-L5五级进化体系的智能引擎，可实现私有化部署，支持多租户SaaS模式</li>
        </ul>
      </div>

      <div className="section" style={{ textAlign: 'center', background: 'linear-gradient(135deg,#f0f7ff,#fff)' }}>
        <h2 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '20px' }}>浙里健康</h2>
        <div className="tags" style={{ justifyContent: 'center' }}>
          <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>24个科普分库</span>
          <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>2351+主任级专家</span>
          <span className="tag" style={{ fontSize: '16px', padding: '10px 20px' }}>专家知识的力量</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">核心场景：大众、医生全闭环AI赋能</h2>
        <p className="text">大众患者、管理机构，木吾木同Medtalent Agent 都能提供专属价值。</p>
        <div className="grid-2">
          <div className="card">
            <h3>为大众百姓</h3>
            <p style={{ marginBottom: '15px', fontSize: '16px', color: 'var(--text-main)' }}><strong>MED-Life Style Claw——生活方式医学智能体空间</strong></p>
            <ul>
              <li>自然语言对话互动，高效获取健康资讯</li>
              <li>构建使用者健康画像，动态孪生，智能体自动匹配</li>
              <li>匹配推送健康信息</li>
              <li>构建动态打卡跟踪管理生态</li>
              <li>推送非医类专业健康用品</li>
              <li>联结医生矩阵相关科普知识</li>
              <li>打通专业医生、医院智能体</li>
            </ul>
          </div>
          <div className="card">
            <h3>为医生</h3>
            <p style={{ marginBottom: '15px', fontSize: '16px', color: 'var(--text-main)' }}><strong>DOCTOR VOICE AGENT-医声智能体空间</strong></p>
            <ul>
              <li>释放医生潜能，专注核心医疗</li>
              <li>自动生成结构化电子病历，减少书写时间</li>
              <li>AI辅助鉴别诊断，降低漏诊误诊风险</li>
              <li>智能检索医学文献，实时获取最新指南</li>
              <li>自动随访管理，提高患者依从性</li>
              <li>健康画像跟踪提醒，建立患者健康管理习惯</li>
              <li>精准推送资讯套餐，助力患者提高健康认知</li>
              <li>对应匹配健康套餐、产品，助力知识智慧阳光变现</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}