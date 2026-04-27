const fs = require('fs');
const path = require('path');

const dir = '/workspace/landing/src/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const replacements = [
  { old: '<span className="text-[28px]">🌊</span> ', new: '' },
  { old: '<span className="text-[28px]">🤝</span> ', new: '' },
  { old: '🔍 <strong>', new: '<strong>' },
  { old: '✅ <strong>', new: '<strong>' },
  { old: '🎯 1+N', new: '1+N' },
  { old: '发起咨询 🚀', new: '发起咨询' },
  { old: '⚙️ L1-L5', new: 'L1-L5' },
  { old: '▶️ 重新模拟', new: '重新模拟' },
  { old: '▶️ 模拟处理体检报告', new: '模拟处理体检报告' },
  { old: '✅ 处理管线', new: '处理管线' },
  { old: '📚 RAG', new: 'RAG' },
  { old: '⚠️ AI', new: 'AI' },
  { old: '🎯 大众端', new: '大众端' },
  { old: '🚀 进入大众端', new: '进入大众端' },
  { old: '✅ 官方权威资质：', new: '官方权威资质：' },
  { old: '✅ 顶级名医壁垒：', new: '顶级名医壁垒：' },
  { old: '✅ 全场景专业覆盖：', new: '全场景专业覆盖：' },
  { old: '<span>✅</span>', new: '<span>•</span>' },
  { old: '🏠 长寿屋', new: '长寿屋' },
  { old: '💪 男性活力', new: '男性活力' },
  { old: '❤️ 体重管理', new: '体重管理' },
  { old: '🌙 安睡阁', new: '安睡阁' },
  { old: '🧘 减压馆', new: '减压馆' },
  { old: '🩺 慢病管理', new: '慢病管理' },
  { old: '🤰 孕养轩', new: '孕养轩' },
  { old: '🛡️ 免疫提升', new: '免疫提升' },
  { old: '🫘 肠道健康', new: '肠道健康' },
  { old: '✨ 美颜内调', new: '美颜内调' },
  { old: '👨‍⚕️ 医生端', new: '医生端' },
  { old: '⚕️ 进入医生端', new: '进入医生端' },
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  replacements.forEach(r => {
    if (content.includes(r.old)) {
      content = content.replaceAll(r.old, r.new);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
