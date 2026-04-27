const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FINAL_DIST = path.join(ROOT_DIR, 'dist');

const LANDING_DIST = path.join(ROOT_DIR, 'landing', 'dist');
const DEMO_DIST = path.join(ROOT_DIR, 'demo', 'dist');
const WUTONG_DIST = path.join(ROOT_DIR, 'zheli-wutong', 'dist');

async function buildDeployPackage() {
  try {
    console.log('🧹 正在清理旧的打包目录...');
    await fs.remove(FINAL_DIST);
    await fs.ensureDir(FINAL_DIST);

    console.log('📦 正在合并主落地页(landing)产物...');
    if (await fs.pathExists(LANDING_DIST)) {
      await fs.copy(LANDING_DIST, FINAL_DIST);
    } else {
      console.warn('⚠️ 警告: landing/dist 不存在');
    }

    console.log('📦 正在合并医生端(demo)产物...');
    const targetDemoDir = path.join(FINAL_DIST, 'demo');
    if (await fs.pathExists(DEMO_DIST)) {
      await fs.ensureDir(targetDemoDir);
      await fs.copy(DEMO_DIST, targetDemoDir);
    } else {
      console.warn('⚠️ 警告: demo/dist 不存在');
    }

    console.log('📦 正在合并大众端(wutong)产物...');
    const targetWutongDir = path.join(FINAL_DIST, 'wutong');
    if (await fs.pathExists(WUTONG_DIST)) {
      await fs.ensureDir(targetWutongDir);
      await fs.copy(WUTONG_DIST, targetWutongDir);
    } else {
      console.warn('⚠️ 警告: zheli-wutong/dist 不存在');
    }

    console.log('✅ 所有项目产物已成功合并至根目录的 dist 文件夹！');
    console.log('📁 请将 /workspace/dist 目录下的所有文件直接上传至宝塔面板的网站根目录。');

  } catch (err) {
    console.error('❌ 合并产物时发生错误:', err);
    process.exit(1);
  }
}

buildDeployPackage();
