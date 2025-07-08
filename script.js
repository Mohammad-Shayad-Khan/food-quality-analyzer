document.getElementById("qualityForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const moisture = parseFloat(document.getElementById("moisture").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const color = parseInt(document.getElementById("color").value);
  const result = document.getElementById("result");

  let message = "";

  if (moisture <= 12 && ph >= 4.5 && ph <= 6.5 && color >= 5) {
    message = "✅ Food Quality: ACCEPTABLE";
    result.style.color = "green";
  } else {
    message = "❌ Food Quality: NOT ACCEPTABLE";
    result.style.color = "red";
  }

  result.textContent = message;
});