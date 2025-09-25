// import fetch from "node-fetch";

// export async function handler(event) {
//   const keyword = event.queryStringParameters.keyword;
//   const API_KEY = process.env.API_KEY; // Netlify 환경변수

//   const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&srchTarget=total&kwd=${encodeURIComponent(keyword)}&pageNum=1&pageSize=10&category=도서&apiType=json`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     return { statusCode: 200, body: JSON.stringify(data) };
//   } catch (err) {
//     return { statusCode: 500, body: JSON.stringify({ error: "API 호출 실패" }) };
//   }
// }


export async function handler(event, context) {
  try {
    const query = event.queryStringParameters?.q;
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "검색어를 입력해주세요." }),
      };
    }

    const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${
      process.env.API_KEY
    }&srchTarget=total&kwd=${encodeURIComponent(query)}&pageNum=1&pageSize=10&category=도서&apiType=json`;

    const response = await fetch(url);

    // JSON이 아닌 경우 대비
    const text = await response.text();

    if (!response.ok) {
      console.error("API 호출 실패:", text);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API 호출 실패", detail: text }),
      };
    }

    let rawData;
    try {
      rawData = JSON.parse(text);
    } catch {
      console.error("JSON 파싱 실패:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "JSON 파싱 실패", detail: text }),
      };
    }

    const books = rawData?.body?.books || [];

    const filteredData = books.map((book) => ({
      title: book.titleInfo,
      category: book.category,
      link: book.linkUrl,
      imageUrl: book.imageUrl
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(filteredData),
    };
  } catch (err) {
    console.error("Function 에러:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "서버 에러 발생", detail: err.message }),
    };
  }
}
