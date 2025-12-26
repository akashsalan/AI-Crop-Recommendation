// ------------------------------
// Expanded Mock Knowledge Base (15 crops + general queries)
// ------------------------------
const mockData = [
  {
    keywords: ["paddy", "rice"],
    answer: "🌾 Paddy Guide:\n- Best in Ranchi during monsoon.\n- Urea: 40kg/acre in 2 splits (20 & 40 DAS).\n- Needs standing water, irrigate regularly.\n- MOP: 15kg/acre at tillering stage."
  },
  {
    keywords: ["wheat"],
    answer: "🌾 Wheat Guide:\n- Suitable for winter (Rabi season).\n- Urea: 30kg/acre at first irrigation.\n- DAP: 50kg/acre basal dose at sowing.\n- Requires 3–4 irrigations."
  },
  {
    keywords: ["maize", "corn"],
    answer: "🌽 Maize Guide:\n- Grows well in loamy soil with good rainfall.\n- Urea: 30kg/acre at 20 DAS.\n- DAP: 50kg/acre basal dose.\n- Irrigate during tasseling stage."
  },
  {
    keywords: ["gram", "chickpea"],
    answer: "🌱 Gram Guide:\n- Ideal for dry areas.\n- Urea: 20kg/acre at sowing.\n- SSP: 40kg/acre basal dose.\n- Gypsum 100kg/acre before flowering."
  },
  {
    keywords: ["lentil"],
    answer: "🌱 Lentil Guide:\n- Requires cool climate.\n- Urea: 15–20kg/acre basal.\n- SSP: 40kg/acre at sowing.\n- Avoid excess irrigation."
  },
  {
    keywords: ["pigeon pea", "arhar", "toor"],
    answer: "🌱 Pigeon Pea Guide:\n- Good for kharif season.\n- Urea: 20kg/acre at sowing.\n- SSP: 60kg/acre basal.\n- Needs irrigation at flowering."
  },
  {
    keywords: ["mustard"],
    answer: "🌼 Mustard Guide:\n- Best for Rabi season.\n- Urea: 20kg/acre before first irrigation.\n- DAP: 40kg/acre basal.\n- Needs irrigation at flowering stage."
  },
  {
    keywords: ["soybean"],
    answer: "🌱 Soybean Guide:\n- Ideal for June–July sowing.\n- Urea: 15kg/acre basal dose.\n- SSP: 60kg/acre at sowing.\n- Gypsum: 100kg/acre at flowering."
  },
  {
    keywords: ["groundnut", "peanut"],
    answer: "🥜 Groundnut Guide:\n- Needs sandy loam soil.\n- Gypsum: 200kg/acre at pegging.\n- SSP: 50kg/acre basal.\n- Avoid waterlogging."
  },
  {
    keywords: ["sorghum", "jowar"],
    answer: "🌱 Sorghum Guide:\n- Drought-tolerant crop.\n- Urea: 20–25kg/acre at 20 DAS.\n- DAP: 40kg/acre basal.\n- Rainfed crop, needs minimal irrigation."
  },
  {
    keywords: ["pearl millet", "bajra"],
    answer: "🌱 Pearl Millet Guide:\n- Grows in sandy soil.\n- Urea: 15–20kg/acre basal.\n- DAP: 35kg/acre at sowing.\n- Irrigate once at flowering."
  },
  {
    keywords: ["potato"],
    answer: "🥔 Potato Guide:\n- Best in alluvial soil.\n- Urea: 40kg/acre split at 20 & 40 DAS.\n- DAP: 50kg/acre basal.\n- Needs irrigation every 10–12 days."
  },
  {
    keywords: ["sugarcane"],
    answer: "🌱 Sugarcane Guide:\n- Long-duration crop (10–12 months).\n- Urea: 80kg/acre in 3 splits.\n- SSP: 100kg/acre basal.\n- MOP: 40kg/acre at grand growth stage."
  },
  {
    keywords: ["sunflower"],
    answer: "🌻 Sunflower Guide:\n- Short-duration crop (~100 days).\n- Urea: 25kg/acre at 20 DAS.\n- SSP: 40kg/acre basal.\n- MOP: 20kg/acre at flowering."
  },
  {
    keywords: ["blackgram", "urad"],
    answer: "🌱 Blackgram Guide:\n- Best in kharif season.\n- Urea: 10–15kg/acre at sowing.\n- SSP: 30–40kg/acre basal.\n- Requires moist soil but avoid waterlogging."
  },
  {
    keywords: ["weather", "rain", "forecast"],
    answer: "🌦️ Weather Update: This week shows moderate rainfall with temperatures between 26–32°C. Good conditions for sowing kharif crops."
  },
  {
    keywords: ["market", "price", "mandi"],
    answer: "💰 Market Update: Paddy ₹1800/quintal (Rising), Wheat ₹2200/quintal (Stable), Mustard ₹4200/quintal (Rising)."
  },
  {
    keywords: ["hello", "hi", "namaste"],
    answer: "👋 Namaste! I am your Krishi Saathi. Ask me about crops, fertilizers, weather, or market prices."
  },
  {
    keywords: ["thank you", "thanks", "dhanyavaad"],
    answer: "🙏 Always happy to help! Wish you a great harvest 🌱."
  }
];

// ------------------------------
// DOM Elements
// ------------------------------
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

// ------------------------------
// Utility: Add Message
// ------------------------------
function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `<div class="bubble">${text.replace(/\n/g, "<br>")}</div>`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ------------------------------
// Bot Reply (Flexible Matching)
// ------------------------------
function getBotResponse(input) {
  const query = input.toLowerCase();

  // Try to find a match in knowledge base
  for (let item of mockData) {
    for (let kw of item.keywords) {
      if (query.includes(kw)) {
        return item.answer;
      }
    }
  }

  // Default fallback
  return "🤔 I don't have exact info on that, but you can ask me about crops, fertilizers, weather, or market prices.";
}

// ------------------------------
// Handle User Input
// ------------------------------
function handleUserInput() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  setTimeout(() => {
    const response = getBotResponse(text);
    addMessage("bot", response);
    speakText(response);
  }, 600);
}

sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// ------------------------------
// Voice Input (Speech-to-Text)
// ------------------------------
voiceBtn.addEventListener("click", () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN"; // set to "hi-IN" for Hindi
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage("user", transcript);

    setTimeout(() => {
      const response = getBotResponse(transcript);
      addMessage("bot", response);
      speakText(response);
    }, 600);
  };

  recognition.onerror = () => {
    alert("Speech recognition error. Please try again.");
  };
});

// ------------------------------
// Bot Voice Output (Text-to-Speech)
// ------------------------------
function speakText(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // change to "hi-IN" for Hindi output
  speechSynthesis.speak(utterance);
}
