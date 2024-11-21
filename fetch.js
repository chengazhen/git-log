export async function generateDailyReport(commits) {
  // 预设
  const systemMessage = {
    role: "system",
    content:
      "我希望你作为一个钉钉日报的助手，能够根据我提供的git提交记录，生成一份钉钉日报。严格按照钉钉日报的格式，不要有任何的格式错误。",
  };

  try {
    const response = await fetch("http://49.234.181.38:8181/v1/chat/completions", {
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
