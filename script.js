document.getElementById("qualityForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const category = document.getElementById("category").value;
  const moisture = parseFloat(document.getElementById("moisture").value);
  const temperature = parseFloat(document.getElementById("temperature").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const color = parseInt(document.getElementById("color").value);
  const microbial = parseFloat(document.getElementById("microbial").value);
  const result = document.getElementById("result");
  const suggestionBox = document.getElementById("suggestion");

  const standards = {
    juice:     { moisture: 85, tempMin: 4, tempMax: 10, phMin: 3.0, phMax: 4.5, color: 5, microMax: 1000 },
    bakery:    { moisture: 15, tempMin: 20, tempMax: 30, phMin: 5.0, phMax: 6.5, color: 6, microMax: 100000 },
    beverage:  { moisture: 90, tempMin: 2, tempMax: 10, phMin: 2.5, phMax: 4.5, color: 5, microMax: 500 },
    dairy:     { moisture: 88, tempMin: 4, tempMax: 8, phMin: 6.4, phMax: 6.8, color: 6, microMax: 100000 },
    poultry:   { moisture: 70, tempMin: 0, tempMax: 4, phMin: 5.5, phMax: 6.2, color: 5, microMax: 10000 },
    fish:      { moisture: 75, tempMin: -1, tempMax: 4, phMin: 6.0, phMax: 6.8, color: 5, microMax: 10000 },
    egg:       { moisture: 74, tempMin: 0, tempMax: 7, phMin: 7.6, phMax: 9.2, color: 6, microMax: 5000 },
    canned:    { moisture: 30, tempMin: 20, tempMax: 40, phMin: 4.2, phMax: 6.0, color: 5, microMax: 0 }
  };

  const preserveMethods = {
    juice: "Refrigeration or pasteurization.",
    bakery: "Vacuum packaging or low-moisture storage.",
    beverage: "Cold chain maintenance and aseptic packaging.",
    dairy: "Cold storage, pasteurization or fermentation.",
    poultry: "Freezing below -18°C or vacuum packaging.",
    fish: "Chilling on ice or freezing rapidly.",
    egg: "Cold storage and UV sanitization.",
    canned: "Retort sterilization and dry storage."
  };

  if (!standards[category]) {
    result.innerHTML = "<span class='fail'>❌ Please select a valid food category.</span>";
    return;
  }

  const s = standards[category];
  const checks = {
    moisture: moisture <= s.moisture,
    temperature: temperature >= s.tempMin && temperature <= s.tempMax,
    ph: ph >= s.phMin && ph <= s.phMax,
    color: color >= s.color,
    microbial: microbial <= s.microMax
  };

  let messages = [];

  function check(condition, name) {
    if (condition) {
      messages.push(`✅ ${name} OK`);
      return `<div class="pass">${name}: ✔ Passed</div>`;
    } else {
      messages.push(`❌ ${name} FAILED`);
      return `<div class="fail">${name}: ✖ Failed</div>`;
    }
  }

  const allOk = Object.values(checks).every(Boolean);
  const details = `
    ${check(checks.moisture, "Moisture")}
    ${check(checks.temperature, "Temperature")}
    ${check(checks.ph, "pH")}
    ${check(checks.color, "Color")}
    ${check(checks.microbial, "Microbial Load")}
  `;

  result.innerHTML = (allOk
    ? "<h3 style='color:green'>✅ Food Quality: ACCEPTABLE</h3>"
    : "<h3 style='color:red'>❌ Food Quality: NOT ACCEPTABLE</h3>"
  ) + details;

  // Microbial impact
  let microStatus = "";
  if (microbial > s.microMax * 10) {
    microStatus = "⚠️ Extremely high microbial load! Immediate disposal recommended.";
  } else if (microbial > s.microMax * 2) {
    microStatus = "⚠️ Microbial risk is high. May cause foodborne illness.";
  } else {
    microStatus = "✅ Microbial level is within safe range.";
  }

  // Expiry prediction
  let expiryDays = 7; // base estimate
  if (microbial > s.microMax * 10) expiryDays = 0;
  else if (microbial > s.microMax * 2) expiryDays = 1;
  else if (microbial > s.microMax) expiryDays = 3;
  else expiryDays = category === "canned" ? 180 : 7;

  // Preservation suggestion
  const suggestionText = `
    <h4>📋 Suggestions:</h4>
    <p>${microStatus}</p>
    <p><strong>Recommended Preservation:</strong> ${preserveMethods[category]}</p>
    <p><strong>Estimated Expiry:</strong> ${expiryDays} day(s)</p>
  `;
  suggestionBox.innerHTML = suggestionText;
});


 
