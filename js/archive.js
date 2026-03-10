const archive = document.getElementById("archive");

let html = "";

accaPredictions.slice(1).forEach((day) => {
  html += `
<div class="card-prediction">

<h4>${day.date}</h4>

`;

  day.matches.forEach((m) => {
    html += `<p>${m.match} - ${m.tip}</p>`;
  });

  html += `</div>`;
});

archive.innerHTML = html;
