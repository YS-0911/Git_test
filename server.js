import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.get("/search", async (req, res) => {
  const { q } = req.query;
  const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${process.env.NL_API_KEY}&srchTarget=total&kwd=${encodeURIComponent(q)}&pageNum=1&pageSize=10&category=도서&apiType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "API 호출 실패" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
