import fs from 'fs';
import path from 'path';

const CONFIG_FILE_NAME = '.git-log-config';
const CONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE, CONFIG_FILE_NAME);

// 配置管理类
class ConfigManager {
  // 获取配置文件路径
  static getConfigPath() {
    return CONFIG_PATH;
  }

  // 保存 API 地址
  static saveApiUrl(apiUrl) {
    if (!apiUrl) {
      throw new Error('请提供有效的 API 地址');
    }

    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiUrl }));
      return true;
    } catch (error) {
      throw new Error(`保存配置失败: ${error.message}`);
    }
  }

  // 读取 API 地址
  static getApiUrl() {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        return config.apiUrl;
      }
      return null;
    } catch (error) {
      console.error('读取配置失败:', error);
      return null;
    }
  }
}

export default ConfigManager; 