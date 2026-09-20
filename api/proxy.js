module.exports = async function handler(req, res) {
  try {
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 4000);

    const url = "https://push2.eastmoney.com/api/qt/stock/get?fltt=1&invt=2&secid=1.15978713&fields=f43,f169,f170,f46,f44,f45,f47";
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://quote.eastmoney.com/"
      }
    });
    clearTimeout(timeoutTimer);

    if (!resp.ok) {
      return res.status(500).json({ error: "东方财富接口返回异常" });
    }
    const data = await resp.json();

    // CORS跨域头
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.status(200).json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: "代理请求失败", msg: err.message });
  }
}
