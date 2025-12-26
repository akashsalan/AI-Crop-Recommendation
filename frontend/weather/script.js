// ------------------------------
// DOM Elements
// ------------------------------
const districtSelect = document.getElementById("district");
const showDashboardBtn = document.getElementById("showDashboard");
const weatherCards = document.getElementById("weatherCards");
const marketTable = document.querySelector("#marketTable tbody");
const weatherSection = document.getElementById("weatherSection");
const marketSection = document.getElementById("marketSection");
// ------------------------------
// Populate State & District Dropdowns
// ------------------------------
const stateSelect = document.getElementById("state");

// Fill State dropdown
// Fill State dropdown
for (const state in indiaData) {
  const opt = document.createElement("option");
  opt.value = state;
  opt.textContent = state;
  stateSelect.appendChild(opt);
}

// When a state is selected → populate districts
stateSelect.addEventListener("change", function () {
  const state = this.value;
  districtSelect.innerHTML = "<option value='' disabled selected>-- Select District --</option>";

  if (indiaData[state]) {
    indiaData[state].forEach(district => {
      const opt = document.createElement("option");
      opt.value = district;
      opt.textContent = district;
      districtSelect.appendChild(opt);
    });
  }
});



// ------------------------------
// Fetch Weather Data (Open-Meteo)
// ------------------------------
async function getWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    const data = await res.json();

    return data.daily.time.map((day, i) => ({
      day: new Date(day).toLocaleDateString("en-IN", { weekday: "short" }),
      temp: `${Math.round(data.daily.temperature_2m_max[i])}°C`,
      rain: `${Math.round(data.daily.precipitation_sum[i])} mm`,
      icon: data.daily.precipitation_sum[i] > 2 ? "🌧️" : "☀️"
    }));
  } catch (err) {
    console.error("Weather API error:", err);
    return [];
  }
}

// ------------------------------
// Fetch Market Prices (data.gov.in API)
// ------------------------------
// ⚠️ Replace YOUR_API_KEY with a real one from https://data.gov.in
// --- Market Prices Fetch ---
async function getMarketPrices(district) {
  try {
    const apiKey = "579b464db66ec23bdd000001735e622832744f1d65bf16e06123577b"; // replace with your valid key
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[district]=${district.toUpperCase()}&limit=10`;

    const res = await fetch(url);
    const data = await res.json();
    console.log("Market API raw:", data);

    if (!data.records || data.records.length === 0) {
      return [];
    }

    return data.records.map(r => ({
      crop: r.commodity,
      price: r.modal_price,
      market: r.market
    }));
  } catch (err) {
    console.error("Market API error:", err);
    return [];
  }
}

// --- Render Market Prices ---
function renderMarket(market) {
  const marketTable = document.querySelector("#marketTable tbody");
  const marketSection = document.getElementById("marketSection");

  marketTable.innerHTML = "";
  if (market.length) {
    market.forEach(m => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${m.crop}</td>
        <td>₹${m.price}</td>
        <td>${m.market}</td>
      `;
      marketTable.appendChild(row);
    });
  } else {
    marketTable.innerHTML = "<tr><td colspan='3'>No market data available for this district.</td></tr>";
  }

  // Show section
  marketSection.classList.remove("hidden");
}


// ------------------------------
// Render Weather
// ------------------------------
function renderWeather(weather) {
  weatherCards.innerHTML = "";
  if (weather.length) {
    weather.forEach(d => {
      const card = document.createElement("div");
      card.className = "weather-card";
      card.innerHTML = `
        <h3>${d.day}</h3>
        <p class="icon">${d.icon}</p>
        <p><strong>Temp:</strong> ${d.temp}</p>
        <p><strong>Rain:</strong> ${d.rain}</p>
      `;
      weatherCards.appendChild(card);
    });
  } else {
    weatherCards.innerHTML = "<p>No forecast available.</p>";
  }
}

// ------------------------------
// Render Market
// ------------------------------
function renderMarket(market) {
  marketTable.innerHTML = "";
  if (market.length) {
    market.forEach(m => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${m.crop}</td>
        <td>₹${m.price}</td>
        <td>${m.trend}</td>
      `;
      marketTable.appendChild(row);
    });
  } else {
    marketTable.innerHTML = "<tr><td colspan='3'>No market data available.</td></tr>";
  }
}

// ------------------------------
// Event Listener
// ------------------------------
showDashboardBtn.addEventListener("click", async () => {
  const district = districtSelect.value;
  if (!district) {
    alert("Please select a district.");
    return;
  }

  // Get coordinates
  // Get coordinates dynamically from Nominatim
const state = document.getElementById("state").value;
const coords = await getLatLon(district, state);

if (!coords) {
  alert("Could not fetch coordinates for " + district);
  return;
}

// Fetch APIs
const weather = await getWeather(coords.lat, coords.lon);

  const market = await getMarketPrices(district);

  // Render data
  renderWeather(weather);
  renderMarket(market);

  // Show sections
  weatherSection.classList.remove("hidden");
  marketSection.classList.remove("hidden");
});
// --- Function to get lat/lon from Nominatim ---
async function getLatLon(city, state) {
  const query = `${city} district, ${state}, India`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "KrishiSaathi/1.0 (your-email@example.com)", // replace with your email
        "Accept-Language": "en"
      }
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error("Location not found");
    }
  } catch (err) {
    console.error("Nominatim error:", err);
    return null;
  }
}
