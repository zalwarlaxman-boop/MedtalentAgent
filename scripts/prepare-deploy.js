const fs = require('fs-extra');
const path = require('path');

async function prepare() {
  console.log('准备部署目录...');
  const distDir = path.join(__dirname, '../dist');
  
  // 1. 清理 dist 目录
  await fs.emptyDir(distDir);
  
  // 2. 复制 index.html 到 root
  await fs.ensureDir(path.join(distDir, 'root'));
  await fs.copy(path.join(__dirname, '../index.html'), path.join(distDir, 'root/index.html'));
  
  // 3. 复制 demo 产物
  console.log('复制 demo 产物...');
  await fs.copy(path.join(__dirname, '../demo/dist'), path.join(distDir, 'demo'));
  
  // 4. 复制 wutong 产物
  console.log('复制 zheli-wutong 产物...');
  await fs.copy(path.join(__dirname, '../zheli-wutong/dist'), path.join(distDir, 'wutong'));
  
  console.log('部署准备完成！产物位于 dist 目录。');
}

prepare().catch(console.error);
