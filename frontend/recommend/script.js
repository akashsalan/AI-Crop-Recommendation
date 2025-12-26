const API_BASE = "https://sih-crop-backend.onrender.com";

document.getElementById("recommendForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());
  formData.acreage = Number(formData.acreage);
  formData.ph = Number(formData.ph);
  formData.rain_next30 = Number(formData.rain_next30);

  try {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    alert("Error: " + err);
  }
});

function renderResults(data) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  // Top 3 crops
  data.recommendations.forEach(r => {
    const div = document.createElement("div");
    div.className = "crop-card";
    div.innerHTML = `
      <h3>${r.crop.toUpperCase()}</h3>
      <p><strong>Suitability:</strong> ${r.suitability}</p>
      <p><strong>Yield:</strong> ${r.expected_yield_kg} kg</p>
      <p><strong>Profit:</strong> ₹${r.expected_profit_inr}</p>
      <details><summary>Why?</summary><ul>${r.why.map(w=>`<li>${w}</li>`).join("")}</ul></details>
    `;
    container.appendChild(div);
  });

  // Fertilizer plan for top crop
  const fert = data.fertilizer_plan;
  if (fert && fert.length > 0) {
    let table = `<h3>Fertilizer Plan for ${data.recommendations[0].crop}</h3>
    <table class="fert-table">
      <tr><th>Fertilizer</th><th>Formulation</th><th>Stage</th><th>Dosage/acre</th><th>Method</th><th>Notes</th></tr>`;
    fert.forEach(f => {
      table += `<tr>
        <td>${f.fertilizer}</td>
        <td>${f.formulation}</td>
        <td>${f.stage}</td>
        <td>${f.dosage_per_acre}</td>
        <td>${f.application_method}</td>
        <td>${f.notes}</td>
      </tr>`;
    });
    table += "</table>";
    container.innerHTML += table;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  // populate states
  Object.keys(indiaData).forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  // when a state is selected
  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = "<option value='' disabled selected>-- Choose City --</option>";
    const cities = indiaData[stateSelect.value];
    if (cities) {
      cities.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    }
  });
});
// --- 1. Function to get lat/lon from Nominatim ---
async function getLatLon(city, state) {
  const query = `${city} district, ${state}, India`; // 👈 add "district"
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "KrishiSaathi/1.0 (contact@example.com)", // <-- replace with your email
        "Accept-Language": "en"
      }
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error("City not found");
    }
  } catch (err) {
    console.error("Nominatim error:", err);
    return null;
  }
}

// --- 2. Function to fetch SoilGrids data ---
async function getSoilData(lat, lon) {
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}
&property=bdod&property=cec&property=cfvo&property=clay
&property=nitrogen&property=ocd&property=ocs&property=phh2o
&property=sand&property=silt&property=soc
&property=wv0010&property=wv0033&property=wv1500
&depth=0-5cm&value=mean`;


  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("SoilGrids raw response:", data);

    const layers = data?.properties?.layers;
    if (!layers) {
      console.warn("No soil data layers available");
      return null;
    }

    // find phh2o layer
   const phLayer = layers.find(l => l.name === "phh2o");
const sandLayer = layers.find(l => l.name === "sand");
const siltLayer = layers.find(l => l.name === "silt");
const clayLayer = layers.find(l => l.name === "clay");

if (!phLayer || !sandLayer || !siltLayer || !clayLayer) {
  console.warn("Some soil properties missing, using defaults");
  return { ph: "6.5", soilType: "loam" }; // fallback defaults
}

const phRaw = phLayer.depths[0].values.mean;
const ph = phRaw ? (phRaw / 10).toFixed(1) : "6.5";

const sand = sandLayer.depths[0].values.mean ? sandLayer.depths[0].values.mean / 10 : 40;
const silt = siltLayer.depths[0].values.mean ? siltLayer.depths[0].values.mean / 10 : 40;
const clay = clayLayer.depths[0].values.mean ? clayLayer.depths[0].values.mean / 10 : 20;

// classify soil type
let soilType = "loam";
if (sand > 70) soilType = "sandy_loam";
else if (clay > 35) soilType = "clay_loam";

return { ph, soilType };

  } catch (err) {
    console.error("SoilGrids error:", err);
    return null;
  }
}
// --- 2b. Function to fetch Rainfall data ---
async function getRainfall(lat, lon) {
  const proxy = "https://api.allorigins.win/raw?url="; 
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=auto&forecast_days=16`;
  const url = proxy + encodeURIComponent(apiUrl);  

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.daily || !data.daily.precipitation_sum) {
      console.warn("No rainfall data available");
      return null;
    }

    // sum rainfall for next 30 days
    const totalRainfall = data.daily.precipitation_sum.reduce((a, b) => a + b, 0);
    return Math.round(totalRainfall); // mm
  } catch (err) {
    console.error("Rainfall API error:", err);
    return null;
  }
}
function showAutofillMessage(inputId, message) {
  const input = document.getElementById(inputId);
  let note = input.parentElement.querySelector(".autofill-note");

  if (!note) {
    note = document.createElement("div");
    note.className = "autofill-note";
    input.parentElement.appendChild(note);
  }

  note.textContent = message;  // update message permanently
}




// --- 3. Hook into city selection ---
document.getElementById("city").addEventListener("change", async () => {
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;

  // Step A: get coordinates
  const coords = await getLatLon(city, state);
  if (!coords) return;
  console.log(`Selected ${city}, ${state} → lat: ${coords.lat}, lon: ${coords.lon}`);


  // Step B: get soil data
  const soil = await getSoilData(coords.lat, coords.lon);
  if (!soil) return;

  // Step C: autofill form
document.getElementById("ph").value = soil.ph;
document.getElementById("soil_type").value = soil.soilType;

showAutofillMessage("ph", `Auto-filled pH: ${soil.ph}`);
showAutofillMessage("soil_type", `Auto-selected Soil: ${soil.soilType}`);

// Step D: get rainfall
const rain = await getRainfall(coords.lat, coords.lon);
if (rain) {
  document.getElementById("rain_next30").value = rain;
  showAutofillMessage("rain_next30", `Auto-filled Rainfall: ${rain} mm`);
}

 
});

