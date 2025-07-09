document.getElementById("qualityForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const category = document.getElementById("category").value;
  const moisture = parseFloat(document.getElementById("moisture").value);
  const temperature = parseFloat(document.getElementById("temperature").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const color = parseInt(document.getElementById("color").value);
  const microbial = parseFloat(document.getElementById("microbial").value);
  const resultBox = document.getElementById("result");
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

  const reasons = {
    moisture: "High moisture increases water activity (aw), promoting microbial spoilage. Ref: FAO Codex.",
    temperature: "Improper temperature encourages bacterial growth, especially between 5–60°C. Ref: FDA Food Code.",
    ph: "Unsafe pH allows survival of pathogens like Clostridium botulinum. Ref: ICMSF, 2001.",
    color: "Abnormal color may indicate spoilage or oxidation. Ref: Mehta et al., 2013.",
    microbial: "High microbial load indicates contamination or poor hygiene. Ref: Jay, Modern Food Microbiology."
  };

  const s = standards[category];
  if (!s) {
    resultBox.innerHTML = "<span class='fail'>❌ Please select a valid category.</span>";
    return;
  }

  const checks = {
    moisture: moisture <= s.moisture,
    temperature: temperature >= s.tempMin && temperature <= s.tempMax,
    ph: ph >= s.phMin && ph <= s.phMax,
    color: color >= s.color,
    microbial: microbial <= s.microMax
  };

  const failed = Object.keys(checks).filter(key => !checks[key]);

  let output = failed.length === 0
    ? "<h3 style='color:green'>✅ Food Quality: ACCEPTABLE</h3>"
    : "<h3 style='color:red'>❌ Food Quality: NOT ACCEPTABLE</h3>";

  for (const key of Object.keys(checks)) {
    output += `<div class="${checks[key] ? 'pass' : 'fail'}">${key.charAt(0).toUpperCase() + key.slice(1)}: ${checks[key] ? '✔ Passed' : '✖ Failed'}</div>`;
  }

  if (failed.length > 0) {
    output += "<div class='reason'><strong>Reason(s) for Rejection:</strong><ul>";
    failed.forEach(f => {
      output += `<li><b>${f}:</b> ${reasons[f]}</li>`;
    });
    output += "</ul></div>";
  }

  resultBox.innerHTML = output;

  // Suggestion & expiry
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

  let microStatus = microbial > s.microMax * 10
    ? "⚠️ Extremely high microbial load! Risk of food poisoning."
    : microbial > s.microMax * 2
      ? "⚠️ High microbial risk. May cause illness."
      : "✅ Microbial level is safe.";

  let expiry = microbial > s.microMax * 10 ? 0 :
               microbial > s.microMax * 2 ? 1 :
               microbial > s.microMax ? 3 :
               category === "canned" ? 180 : 7;

  suggestionBox.innerHTML = `
    <h4>📋 Suggestions:</h4>
    <p>${microStatus}</p>
    <p><strong>Preservation Tip:</strong> ${preserveMethods[category]}</p>
    <p><strong>Estimated Expiry:</strong> ${expiry} day(s)</p>
  `;
});
