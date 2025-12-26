# 🌾 Asli Fasal — Smart Crop Recommendation & Farming Assistant  
### Team ASTAR | Smart India Hackathon 2025

**Asli Fasal** is a data-driven crop advisory and recommendation platform that helps farmers make smarter, sustainable, and profitable agricultural decisions.  
Developed for **Smart India Hackathon 2025**, it combines AI, IoT, weather intelligence, and user-friendly design to empower farmers with personalized crop and fertilizer insights.

---

## 🏆 Hackathon Details
- **Event:** Smart India Hackathon 2025  
- **Title:** AI-Based Crop Recommendation for Farmers  
- **Theme:** Agriculture, FoodTech & Rural Development  
- **Category:** Software  
- **Organization:** Government of Jharkhand – Department of Higher & Technical Education  

---

## 🚀 Project Overview
Farmers in India face key challenges: unpredictable weather, low soil awareness, fertilizer misuse, and lack of expert advice.  
**Asli Fasal** provides an all-in-one solution through:
- 🌱 **Smart Crop Recommendation** based on soil pH, NPK, rainfall, and season.
- 💧 **Fertilizer Guidance** with stage-wise dosage and timing.
- 🌦️ **Weather & Market Dashboard** (mocked for prototype).
- 💬 **Chat Assistant** with voice/text query support.
- 🧭 **Multilingual & Offline-Ready Design** (upcoming).

---

## 🧩 System Architecture
User Input (pH, Soil, NPK, Rainfall, Month)
↓
FastAPI Backend → Rule-Based Scoring Engine (Decision Tree Logic)
↓
Top 3 Recommended Crops + Fertilizer Plan
↓
Frontend Visualization (HTML, CSS, JavaScript)

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | FastAPI (Python) |
| **Data** | CSV Datasets (`crops.csv`, `fertilizers.csv`) |
| **Algorithm** | Custom Rule-Based Scoring (Decision Tree–Inspired) |
| **APIs (future integration)** | SoilGrids, Open-Meteo, Agmarknet, Govt APIs |
| **Hosting** | Railway (backend) + Netlify/Vercel (frontend) |

---

## 🧠 Algorithm & Decision Logic
Unlike a static ML model, our system uses a **deterministic scoring algorithm** that mimics a Decision Tree’s structure.  
Each crop is scored (0–1) using:

| Factor | Description |
|---------|-------------|
| pH Fit | Linear match between input and crop range |
| Rainfall Fit | Scaled score based on ideal rainfall range |
| Soil Type | Match/penalty logic |
| NPK Alignment | Nutrient requirement comparison |
| Sowing Month | Match with ideal sowing window |
| Crop Rotation | Bonus for non-repetitive family crops |

**Weighted Formula:**
Suitability = 0.25(pH) + 0.25(Rainfall) + 0.15(Soil) + 0.15(Month) + 0.15(NPK) + 0.05(Rotation)

Top 3 crops are ranked by **Suitability + Profit**,  
and the **fertilizer plan** is fetched dynamically from the dataset.

---

## 📊 Current Features (Prototype)
✅ Crop recommendation engine  
✅ Fertilizer guide (stage-wise)  
✅ Weather and market dashboard (mock data)  
✅ Chat assistant (mock NLP + speech)  
✅ Responsive and mobile-friendly UI  
✅ About page & future vision  

---

## 🌍 Live Deployment

| Component | Platform | URL |
|------------|-----------|-----|
| **Frontend** | Vercel | [https://asli-fasal.vercel.app](https://asli-fasal.vercel.app) |
| **Backend** | Render | [https://sih-crop-backend.onrender.com](https://sih-crop-backend.onrender.com) |

---
💡 Innovation Highlights

Mimics Decision Tree reasoning while keeping it interpretable.

Prepares data for future AI/ML models.

Integrates real APIs for soil, weather, and market data.

Scalable to mobile and offline-first rural deployment.

🌤️ Research & References

agricoop.nic.in

icar.org.in

soilhealth.dac.gov.in

mausam.imd.gov.in

enam.gov.in

agmarknet.gov.in

soilgrids.org

open-meteo.com

docs.soilgrids.org

Google Vision API

TensorFlow Agriculture Models

## 📂 Folder Structure
AI-Crop-Recommendation/
│
├── frontend/
│ ├── index.html
│ ├── styles.css
│ ├── recommend/
│ ├── fertilizer/
│ ├── weather/
│ ├── chat/
│ └── about/
│
└── backend/
├── app.py
├── crops.csv
├── fertilizers.csv
├── requirements.txt
