document.getElementById("qualityForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const category = document.getElementById("category").value;
  const moisture = parseFloat(document.getElementById("moisture").value);
  const temperature = parseFloat(document.getElementById("temperature").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const color = parseInt(document.getElementById("color").value);
  const microbial = parseFloat(document.getElementById("microbial").value);
  const result = document.getElementById("result");

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
      messages.push(`✅ ${name} is OK`);
      return `<div class="pass">${name}: ✔ Passed
        <div class="bar"><div class="bar-fill" style="width:100%;">OK</div></div>
      </div>`;
    } else {
      messages.push(`❌ ${name} FAILED`);
      return `<div class="fail">${name}: ✖ Failed
        <div class="bar"><div class="bar-fill" style="width:50%;">Check</div></div>
      </div>`;
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

  // OPTIONAL: Send to Google Sheets if URL is provided
  const sheetURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL"; // Replace with your own
  if (sheetURL) {
    const payload = {
      category,
      moisture,
      temperature,
      ph,
      color,
      microbial,
      result: allOk ? "ACCEPTABLE" : "NOT ACCEPTABLE"
    };

    fetch(sheetURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }).then(() => console.log("✅ Saved to Google Sheet"));
  }
});

