export default function HomeTab() {
  return (
    <div className="tab-content active" style={{ display: 'block' }}>
      <div className="hero">
        <p style={{ fontSize: '24px', marginBottom: '10px', opacity: 0.9 }}>有了病，不担心；少生病，更健康</p>
        <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Medtalent agent 智能体矩阵</h1>
        <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #ffffff, #36CFC9)', margin: '0 auto', borderRadius: '2px' }}></div>
      </div>

      <div className="section" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <p className="text" style={{ fontSize: '20px', color: '#34495e', marginBottom: '40px' }}>
            我们坚信，这是一个值得全力以赴的伟大创业项目，坚持以服务群众为初心，让优质健康服务触手可及！
        </p>

        <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '30px' }}>我们的使命与价值</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px', color: '#2c3e50', display: 'inline-block', textAlign: 'left' }}>
            <li style={{ margin: '15px 0', position: 'relative', paddingLeft: '25px' }}>
                <span style={{ color: '#36CFC9', fontSize: '24px', position: 'absolute', left: 0, top: '-5px' }}>•</span>
                在人工智能浪潮汹涌袭来的时刻，我们站在前沿科技的浪尖之上
            </li>
            <li style={{ margin: '15px 0', position: 'relative', paddingLeft: '25px' }}>
                <span style={{ color: '#36CFC9', fontSize: '24px', position: 'absolute', left: 0, top: '-5px' }}>•</span>
                通过技术创新助力医学科普产业化高质量推进
            </li>
            <li style={{ margin: '15px 0', position: 'relative', paddingLeft: '25px' }}>
                <span style={{ color: '#36CFC9', fontSize: '24px', position: 'absolute', left: 0, top: '-5px' }}>•</span>
                助力医生搭建智能体体系，高效链接广大群众
            </li>
            <li style={{ margin: '15px 0', position: 'relative', paddingLeft: '25px' }}>
                <span style={{ color: '#36CFC9', fontSize: '24px', position: 'absolute', left: 0, top: '-5px' }}>•</span>
                助力百姓轻松获得触手可及的全周期健康管理服务
            </li>
        </ul>

        <p className="text" style={{ fontSize: '19px', fontWeight: 500, color: 'var(--portal-primary)', marginTop: '50px', lineHeight: 1.8 }}>
            推动全民健康理念升级：从被动治疗走向主动健康，从病后管理走向事先预防，全方位助力中国老百姓提升健康认知，守护全民健康！
        </p>
      </div>
    </div>
  );
}