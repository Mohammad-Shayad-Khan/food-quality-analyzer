document.getElementById("qualityForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const moisture = parseFloat(document.getElementById("moisture").value);
  const temperature = parseFloat(document.getElementById("temperature").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const color = parseInt(document.getElementById("color").value);
  const microbial = parseFloat(document.getElementById("microbial").value);
  const result = document.getElementById("result");

  let message = "";

  // Define simple criteria (you can change for real food specs)
  const isMoistureOk = moisture <= 12;
  const isTempOk = temperature >= 4 && temperature <= 25;
  const isPhOk = ph >= 4.5 && ph <= 6.5;
  const isColorOk = color >= 5;
  const isMicrobialOk = microbial <= 100000; // 10^5 cfu/g threshold

  if (isMoistureOk && isTempOk && isPhOk && isColorOk && isMicrobialOk) {
    message = "✅ Food Quality: ACCEPTABLE";
    result.style.color = "green";
  } else {
    message = "❌ Food Quality: NOT ACCEPTABLE";
    result.style.color = "red";
  }

  result.textContent = message;
});
