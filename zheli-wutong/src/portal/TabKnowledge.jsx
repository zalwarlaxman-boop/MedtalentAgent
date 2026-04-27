import React from 'react';

export default function TabKnowledge() {
  return (
    <div className="tab-content active">
      <div className="hero">
        <h1>木吾木同Medtalent agent os</h1>
        <p>基于 Multi-Agent 协作架构</p>
      </div>

      <div className="section">
        <h2 className="section-title">智能健康知识引擎</h2>
        <p className="text">
          收录超 5000 万条权威医学数据，基于大模型与知识图谱技术，为健康专业人士提供精准、权威、实时的专业知识检索与辅助决策支持。
        </p>
        <p className="text"><strong>浙江省健康科普专家库分库</strong> 2351名主任级专家知识底座</p>
        <p className="text" style={{ fontWeight: 'bold' }}>浙里健康24个专业分库：</p>
        <div className="tags">
          <span className="tag">老年健康科普分库</span><span className="tag">眼底健康科普分库</span><span className="tag">头颈甲状腺外科科普分库</span>
          <span className="tag">结核病防治科普分库</span><span className="tag">艾滋病防治科普分库</span><span className="tag">免疫规划科普分库</span>
          <span className="tag">口腔保健科普分库</span><span className="tag">中医保健科普专家</span><span className="tag">慢病(体)理科普分库</span>
          <span className="tag">乳腺外科科普分库</span><span className="tag">控烟科普分库</span><span className="tag">近视防控科普分库</span>
          <span className="tag">心理健康科普分库</span><span className="tag">肿瘤防治科普分库</span><span className="tag">妇女保健科科普分库</span>
          <span className="tag">儿童保健科普分库</span><span className="tag">心血管科普分库</span><span className="tag">颈肩腰腿病保健科普分库</span>
          <span className="tag">肿瘤与营养科普分库</span><span className="tag">骨科健康科普分库</span><span className="tag">皮肤病与医学美容科普分库</span>
          <span className="tag">呼吸健康分库</span><span className="tag">护理科普分库</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">核心知识模块</h2>
        <div className="grid-2">
          <div className="card">
            <h3>临床指南</h3>
            <p className="text" style={{ fontSize: '14px' }}>• 覆盖 2500+ 权威机构发布的最新临床诊疗指南与专家共识</p>
            <p className="text" style={{ fontSize: '14px' }}>• 支持目录浏览，快速定位对应诊疗规范</p>
          </div>
          <div className="card">
            <h3>药品百科</h3>
            <p className="text" style={{ fontSize: '14px' }}>• 涵盖 15000+ 处方药、OTC 及中成药的详细说明书与相互作用说明</p>
            <p className="text" style={{ fontSize: '14px' }}>• 提供目录浏览，方便查询药品信息</p>
          </div>
          <div className="card">
            <h3>医学知识图谱</h3>
            <p className="text" style={{ fontSize: '14px' }}>• 包含 8000+ 基于知识图谱构建的疾病关联分析与病理机制内容</p>
            <p className="text" style={{ fontSize: '14px' }}>• 支持目录浏览，直观理解疾病间的逻辑关系</p>
          </div>
          <div className="card">
            <h3>健康检测</h3>
            <p className="text" style={{ fontSize: '14px' }}>• 覆盖 3000+ 各类医学检验项目解读、正常值范围及临床意义</p>
            <p className="text" style={{ fontSize: '14px' }}>• 提供目录浏览，助力快速解读检验报告</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">开放能力与服务</h2>
        <div className="level-item">
          <h3>知识库 API 接入</h3>
          <p className="text">提供标准 RESTful API，支持企业级私有化部署，可快速集成至现有医疗系统。</p>
        </div>
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '21px', color: 'var(--primary)', marginBottom: '15px' }}>数据合作</h3>
          <p className="text">我们诚邀医疗机构、科研院所及出版集团开展数据共建与知识共享。</p>
        </div>
      </div>
    </div>
  );
}