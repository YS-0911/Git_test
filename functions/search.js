import fetch from "node-fetch";

export async function handler(event) {
  const keyword = event.queryStringParameters.keyword;
  const API_KEY = process.env.API_KEY; // Netlify 환경변수

  const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&srchTarget=total&kwd=${encodeURIComponent(keyword)}&pageNum=1&pageSize=10&category=도서&apiType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "API 호출 실패" }) };
  }
}
