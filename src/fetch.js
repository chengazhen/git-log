import ConfigManager from './config.js';

// 设置默认的 AI API 地址
const DEFAULT_AI_API_URL = "http://49.234.181.38:8181/v1/chat/completions";

export async function generateDailyReport(commits) {
  // 预设
  const systemMessage = {
    role: "system",
    content: `
    我希望你作为一个钉钉日报的助手，能够根据我提供的git提交记录，
    生成一份钉钉日报。一定要把我的内容总结的完整一些，如果有一些无关紧要的提交，请不要总结进去; 
    严格按照我下面提供的格式生成，不要有任何的格式错误。使用z 
      ---
      **今日工作内容**  
        + xxxx
        + xxxx
        + xxxx
      **遇到的问题与解决方案**  
        + xxxx
        + xxxx
        + xxxx
      **明日工作计划**  
        + xxxx
        + xxxx
        + xxxx
      ---
      `,
  };

  // 优先使用参数中的 apiUrl，其次使用配置文件中的地址，最后使用默认地址
  const apiUrl = ConfigManager.getApiUrl() || DEFAULT_AI_API_URL;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [systemMessage, { role: "user", content: commits }],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("生成日报失败:", error);
    throw error;
  }
}
