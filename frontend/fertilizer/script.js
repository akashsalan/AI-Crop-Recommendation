// ------------------------------
// Knowledge Base (15 Crops × Fertilizers)
// ------------------------------
const fertilizerData = {
  paddy: {
    Urea: {
      dosage: "40 kg/acre in 2 splits",
      timing: "20 and 40 days after transplanting",
      method: "Broadcast evenly, avoid standing water",
      water: "Irrigate lightly after application"
    },
    SSP: {
      dosage: "60 kg/acre",
      timing: "Basal dose before transplanting",
      method: "Band placement during land preparation",
      water: "Maintain moist soil for uptake"
    },
    MOP: {
      dosage: "15 kg/acre",
      timing: "Tillering stage (30–35 DAS)",
      method: "Broadcast around root zone",
      water: "Irrigate immediately after"
    }
  },
  maize: {
    Urea: {
      dosage: "30 kg/acre",
      timing: "20–25 DAS",
      method: "Band near root zone",
      water: "Light irrigation after application"
    },
    DAP: {
      dosage: "50 kg/acre",
      timing: "Basal at sowing",
      method: "Place 5 cm below seed",
      water: "Ensure moist soil at sowing"
    },
    MOP: {
      dosage: "20 kg/acre",
      timing: "Before tasseling stage",
      method: "Broadcast around plant base",
      water: "Irrigate after application"
    }
  },
  wheat: {
    Urea: {
      dosage: "30 kg/acre",
      timing: "At first irrigation (20–25 DAS)",
      method: "Broadcast or band near roots",
      water: "Apply with irrigation"
    },
    DAP: {
      dosage: "50 kg/acre",
      timing: "Basal at sowing",
      method: "Place below seed line",
      water: "Ensure adequate soil moisture"
    },
    MOP: {
      dosage: "15 kg/acre",
      timing: "Tillering stage",
      method: "Broadcast near plants",
      water: "Irrigate within 24 hrs"
    }
  },
  gram: {
    Urea: {
      dosage: "20 kg/acre",
      timing: "At sowing as starter dose",
      method: "Placed with seed",
      water: "Moist soil required"
    },
    SSP: {
      dosage: "40 kg/acre",
      timing: "Basal dose",
      method: "Band placement below seed",
      water: "Ensure field is moist"
    },
    Gypsum: {
      dosage: "100 kg/acre",
      timing: "Before flowering",
      method: "Broadcast evenly",
      water: "Light irrigation needed"
    }
  },
  lentil: {
    Urea: {
      dosage: "15–20 kg/acre",
      timing: "Basal dose",
      method: "Place below seed",
      water: "Apply in moist soil"
    },
    SSP: {
      dosage: "40 kg/acre",
      timing: "At sowing",
      method: "Band placement",
      water: "Keep soil moist"
    }
  },
  pigeon_pea: {
    Urea: {
      dosage: "20 kg/acre",
      timing: "At sowing",
      method: "Band placement",
      water: "Rainfed crop, irrigate if dry"
    },
    SSP: {
      dosage: "60 kg/acre",
      timing: "At sowing",
      method: "Placed below seed",
      water: "Moisture essential"
    },
    MOP: {
      dosage: "15 kg/acre",
      timing: "Flowering stage",
      method: "Broadcast",
      water: "Light irrigation after"
    }
  },
  mustard: {
    Urea: {
      dosage: "20 kg/acre",
      timing: "Before first irrigation",
      method: "Broadcast uniformly",
      water: "Irrigate after application"
    },
    DAP: {
      dosage: "40 kg/acre",
      timing: "Basal at sowing",
      method: "Band placement below seed",
      water: "Soil should be moist"
    },
    MOP: {
      dosage: "10–15 kg/acre",
      timing: "Top dressing at flowering",
      method: "Broadcast evenly",
      water: "Light irrigation required"
    }
  },
  soybean: {
    Urea: {
      dosage: "15 kg/acre",
      timing: "Basal dose",
      method: "Mix with soil at sowing",
      water: "Apply with irrigation"
    },
    SSP: {
      dosage: "60 kg/acre",
      timing: "At sowing",
      method: "Band placement",
      water: "Moisture necessary"
    },
    Gypsum: {
      dosage: "100 kg/acre",
      timing: "At flowering",
      method: "Broadcast",
      water: "Light irrigation required"
    }
  },
  groundnut: {
    Gypsum: {
      dosage: "200 kg/acre",
      timing: "At pegging stage",
      method: "Broadcast around base",
      water: "Irrigate lightly"
    },
    SSP: {
      dosage: "50 kg/acre",
      timing: "Basal dose",
      method: "Placed with seed",
      water: "Soil moisture required"
    }
  },
  sorghum: {
    Urea: {
      dosage: "20–25 kg/acre",
      timing: "20 DAS",
      method: "Band near root zone",
      water: "Light irrigation after"
    },
    DAP: {
      dosage: "40 kg/acre",
      timing: "Basal at sowing",
      method: "Below seed line",
      water: "Moist soil needed"
    }
  },
  pearl_millet: {
    Urea: {
      dosage: "15–20 kg/acre",
      timing: "20 DAS",
      method: "Broadcast around plants",
      water: "Irrigate immediately"
    },
    DAP: {
      dosage: "35 kg/acre",
      timing: "Basal at sowing",
      method: "Place below seed",
      water: "Keep soil moist"
    }
  },
  potato: {
    Urea: {
      dosage: "40 kg/acre",
      timing: "20 and 40 DAS",
      method: "Broadcast along ridges",
      water: "Light irrigation required"
    },
    DAP: {
      dosage: "50 kg/acre",
      timing: "Basal before planting",
      method: "Mix in ridges",
      water: "Moist soil preferred"
    },
    MOP: {
      dosage: "20 kg/acre",
      timing: "At earthing up",
      method: "Broadcast",
      water: "Irrigate after application"
    }
  },
  sugarcane: {
    Urea: {
      dosage: "80 kg/acre in 3 splits",
      timing: "30, 60, 90 DAS",
      method: "Side dressing",
      water: "Irrigate immediately"
    },
    SSP: {
      dosage: "100 kg/acre",
      timing: "Basal before planting",
      method: "Band placement in furrows",
      water: "Field must be moist"
    },
    MOP: {
      dosage: "40 kg/acre",
      timing: "At grand growth stage",
      method: "Broadcast between rows",
      water: "Light irrigation needed"
    }
  },
  sunflower: {
    Urea: {
      dosage: "25 kg/acre",
      timing: "20–25 DAS",
      method: "Broadcast",
      water: "Irrigate lightly"
    },
    SSP: {
      dosage: "40 kg/acre",
      timing: "Basal at sowing",
      method: "Band placement",
      water: "Moisture necessary"
    },
    MOP: {
      dosage: "20 kg/acre",
      timing: "At flowering",
      method: "Broadcast evenly",
      water: "Irrigate after application"
    }
  },
  blackgram: {
    Urea: {
      dosage: "10–15 kg/acre",
      timing: "Basal at sowing",
      method: "Placed with seed",
      water: "Moisture essential"
    },
    SSP: {
      dosage: "30–40 kg/acre",
      timing: "Basal dose",
      method: "Band placement",
      water: "Keep soil moist"
    }
  }
};

// ------------------------------
// DOM Elements
// ------------------------------
const cropSelect = document.getElementById("crop");
const fertSelect = document.getElementById("fertilizer");
const resultSection = document.getElementById("fertilizerResult");
const form = document.getElementById("fertilizerForm");

// ------------------------------
// Populate Fertilizer Dropdown
// ------------------------------
cropSelect.addEventListener("change", () => {
  fertSelect.innerHTML = '<option value="">-- Select Fertilizer --</option>';
  fertSelect.disabled = true;

  const crop = cropSelect.value;
  if (crop && fertilizerData[crop]) {
    Object.keys(fertilizerData[crop]).forEach(fert => {
      const opt = document.createElement("option");
      opt.value = fert;
      opt.textContent = fert;
      fertSelect.appendChild(opt);
    });
    fertSelect.disabled = false;
  }
});

// ------------------------------
// Handle Form Submit
// ------------------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const crop = cropSelect.value;
  const fert = fertSelect.value;

  if (!crop || !fert) {
    alert("Please select both crop and fertilizer.");
    return;
  }

  const guide = fertilizerData[crop][fert];

  if (guide) {
    resultSection.innerHTML = `
      <div class="result-card">
        <h3>${fert} Usage Guide for ${crop.toUpperCase()}</h3>
        <ul>
          <li><strong>Dosage:</strong> ${guide.dosage}</li>
          <li><strong>Timing:</strong> ${guide.timing}</li>
          <li><strong>Method:</strong> ${guide.method}</li>
          <li><strong>Water Requirement:</strong> ${guide.water}</li>
        </ul>
        <table class="fert-table">
          <tr><th>Aspect</th><th>Details</th></tr>
          <tr><td>Dosage</td><td>${guide.dosage}</td></tr>
          <tr><td>Timing</td><td>${guide.timing}</td></tr>
          <tr><td>Method</td><td>${guide.method}</td></tr>
          <tr><td>Water Requirement</td><td>${guide.water}</td></tr>
        </table>
      </div>
    `;
  } else {
    resultSection.innerHTML = `<p class="error">No data available for ${fert} in ${crop}.</p>`;
  }
});
