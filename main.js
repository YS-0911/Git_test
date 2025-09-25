document.getElementById("searchBtn").addEventListener("click", searchBooks);
let abcd = [];

async function searchBooks() {
  const kwd = document.getElementById("keyword").value.trim();
  if (!kwd) { alert("검색어 입력"); return; }

  try {
    const response = await fetch(`/.netlify/functions/search?keyword=${encodeURIComponent(kwd)}`);
    const data = await response.json();
    abcd = data.result || [];
    render();
  } catch (err) {
    console.error(err);
    document.getElementById("exm").innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
  }
}

const render = () => {
  const filtered = abcd.filter(book => book.imageUrl && book.imageUrl.trim() !== "");
  if (!filtered.length) {
    document.getElementById("exm").innerHTML = "<p>이미지가 있는 검색 결과가 없습니다.</p>";
    return;
  }

  document.getElementById("exm").innerHTML = filtered.map(book => `
    <div class="book-card" style="margin-bottom:20px;">
      <h2>${book.titleInfo}</h2>
      <div class="img-area">
        <a href="${book.detailLink}" target="_blank">
          <img src="https://cover.nl.go.kr/${book.imageUrl}" alt="${book.titleInfo}" style="max-width:150px;">
        </a>
      </div>
    </div>
  `).join("");
};
