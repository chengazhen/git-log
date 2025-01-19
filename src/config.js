import Conf from 'conf';

const config = new Conf({
  projectName: 'git-log'
});

// 配置管理类
class ConfigManager {
  // 保存 API 地址
  static saveApiUrl(apiUrl) {
    if (!apiUrl) {
      throw new Error('请提供有效的 API 地址，例如：https://api.openai.com/v1/chat/completions');
    }

    try {
      config.set('apiUrl', apiUrl);
      console.log('✅ API URL 配置成功');
      return true;
    } catch (error) {
      throw new Error(`保存配置失败: ${error.message}`);
    }
  }

  // 读取 API 地址
  static getApiUrl() {
    try {
      const apiUrl = config.get('apiUrl', null);
      if (!apiUrl) {
        console.warn('⚠️ API URL 未配置，请使用命令配置：git-log config set-api-url <YOUR_API_URL>');
      }
      return apiUrl;
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
      return config.get('author', 'chengchongzhen');
    } catch (error) {
      console.error('读取配置失败:', error);
      return null;
    }
  }

  // 设置 apiKey
  static saveApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('请提供有效的 API Key，格式如：sk-xxxxxxxxxxxxxxxxxxxxxxxx');
    }

    try {
      config.set('apiKey', apiKey);
      console.log('✅ API Key 配置成功');
      return true;
    } catch (error) {
      throw new Error(`保存配置失败: ${error.message}`);
    }
  }

  // 读取 apiKey
  static getApiKey() {
    try {
      const apiKey = config.get('apiKey', null);
      if (!apiKey) {
        console.warn('⚠️ API Key 未配置，请使用命令配置：git-log config set-key -k <YOUR_API_KEY>');
      }
      return apiKey;
    } catch (error) {
      console.error('读取配置失败:', error);
      return null;
    }
  }
}

export default ConfigManager;