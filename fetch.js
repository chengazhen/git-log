export async function generateDailyReport(commits) {
  // 预设
  const systemMessage = {
    role: "system",
    content: `
    我希望你作为一个钉钉日报的助手，能够根据我提供的git提交记录，
    生成一份钉钉日报。一定要把我的内容总结的完整一些，如果有一些无关紧要的提交，请不要总结进去; 
    严格按照我下面提供的格式生成，不要有任何的格式错误。使用中文输出。
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

  try {
    const response = await fetch(
      "https://free.zeroai.chat/v1/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [systemMessage, { role: "user", content: commits }],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("生成日报失败:", error);
    throw error;
  }
}
