import Conf from 'conf';

const config = new Conf({
  projectName: 'git-log'
});

// 配置管理类
class ConfigManager {
  // 保存 API 地址
  static saveApiUrl(apiUrl) {
    if (!apiUrl) {
      throw new Error('请提供有效的 API 地址');
    }

    try {
      config.set('apiUrl', apiUrl);
      return true;
    } catch (error) {
      throw new Error(`保存配置失败: ${error.message}`);
    }
  }

  // 读取 API 地址
  static getApiUrl() {
    try {
      return config.get('apiUrl', null);
    } catch (error) {
      console.error('读取配置失败:', error);
      return null;
    }
  }

  // 设置 author
  static saveAuthor(author) {
    if (!author) {
      throw new Error('请提供有效的作者名称');
    }

    try {
      config.set('author', author);
      return true;
    } catch (error) {
      throw new Error(`保存配置失败: ${error.message}`);
    }
  }

  // 读取 author
  static getAuthor() {
    try {
      return config.get('author', null);
    } catch (error) {
      console.error('读取配置失败:', error);
      return null;
    }
  }
}

export default ConfigManager;