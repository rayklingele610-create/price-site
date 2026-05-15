// Vercel Serverless API - 数据读写接口
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 使用内存存储（Vercel 每次请求会重置，但适合演示）
  // 实际生产环境应该用 Vercel KV 或数据库
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join('/tmp', 'price-data.json');

  try {
    if (req.method === 'GET') {
      // 读取数据
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf8');
        return res.status(200).json(JSON.parse(data));
      }
      return res.status(200).json({ data: [], updatedAt: new Date().toISOString() });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      // 保存数据
      const body = req.body;
      fs.writeFileSync(dataPath, JSON.stringify(body, null, 2));
      return res.status(200).json({ success: true, updatedAt: new Date().toISOString() });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
