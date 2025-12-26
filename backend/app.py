from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

# ----------------------------
# App & CORS
# ----------------------------
app = FastAPI(title="SIH Crop Reco API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow your frontend (or everything for MVP)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Load datasets
# ----------------------------
# Make sure these files exist at backend/data/
crops = pd.read_csv("data/crops.csv")
fertilizers = pd.read_csv("data/fertilizers.csv")

# Map crop -> family for rotation checks
crop_to_family = dict(zip(crops["crop"], crops["family"]))

# ----------------------------
# Helpers
# ----------------------------
def level_match(need: str, level: str) -> float:
    """
    need, level in {low, med, high}
    full score for exact match; 0.5 penalty per step away
    """
    need = str(need).strip().lower()
    level = str(level).strip().lower()
    if need == level:
        return 1.0
    order = {"low": 0, "med": 1, "high": 2}
    if need not in order or level not in order:
        return 0.5  # neutral if invalid label
    return max(0.0, 1 - abs(order[need] - order[level]) * 0.5)

def lin_fit(x: float, lo: float, hi: float) -> float:
    """1.0 inside [lo,hi]; decays linearly outside."""
    try:
        x = float(x); lo = float(lo); hi = float(hi)
    except Exception:
        return 0.0
    if lo <= x <= hi:
        return 1.0
    if x < lo:
        return max(0.0, 1 - (lo - x) / max(lo, 1e-6))
    return max(0.0, 1 - (x - hi) / max(hi, 1e-6))

def month_tag(m: str) -> str:
    return (m or "").strip()[:3].capitalize()

# ----------------------------
# Request / Response models
# ----------------------------
class RecommendBody(BaseModel):
    district: str | None = None          # optional for now
    acreage: float = 1.0
    month: str                           # e.g., "September"
    soil_type: str                       # e.g., "loam"
    ph: float                            # soil pH
    n_level: str                         # "low" | "med" | "high"
    p_level: str                         # "low" | "med" | "high"
    k_level: str                         # "low" | "med" | "high"
    rain_next30: float                   # mm (or your best estimate)
    last_crop: str | None = None         # optional

# ----------------------------
# Routes
# ----------------------------
@app.get("/health")
def health():
    return {"ok": True}

@app.post("/recommend")
def recommend(inp: RecommendBody):
    # derive last crop family for rotation bonus
    last_family = None
    if inp.last_crop and inp.last_crop in crop_to_family:
        last_family = crop_to_family[inp.last_crop]

    results = []
    for _, row in crops.iterrows():
        # component fits
        ph_fit   = lin_fit(inp.ph, row["ph_min"], row["ph_max"])
        rain_fit = lin_fit(inp.rain_next30, row["rain_min_mm"], row["rain_max_mm"])
        soil_fit = 1.0 if str(inp.soil_type).strip().lower() in [s.strip().lower() for s in str(row["soil_type_ok"]).split("|")] else 0.3
        sow_fit  = 1.0 if month_tag(inp.month) in [s.strip() for s in str(row["sowing_months"]).split("|")] else 0.0

        # NPK alignment: average of 3 matches
        npk_align = (
            level_match(row["n_need"], inp.n_level) +
            level_match(row["p_need"], inp.p_level) +
            level_match(row["k_need"], inp.k_level)
        ) / 3.0

        # rotation bonus
        rotation = 0.0
        if last_family:
            rotation = 0.1 if row["family"] != last_family else -0.1

        suitability = 0.25*ph_fit + 0.25*rain_fit + 0.15*soil_fit + 0.15*sow_fit + 0.15*npk_align + 0.05*(rotation + 0.1)
        # clamp 0..1 and round
        suitability = max(0.0, min(1.0, float(suitability)))
        suitability = round(suitability, 2)

        # economics (simple MVP)
        yield_kg = float(row["typical_yield_kg_per_acre"]) * float(inp.acreage)
        revenue  = yield_kg * float(row["base_price_inr_per_kg"])
        cost     = float(row["input_cost_inr"]) * float(inp.acreage)
        profit   = revenue - cost

        why = []
        why.append(f"pH {inp.ph} vs ideal {row['ph_min']}-{row['ph_max']}")
        why.append(f"Rain {inp.rain_next30} mm vs {row['rain_min_mm']}-{row['rain_max_mm']} mm")
        why.append("Soil type matches" if soil_fit == 1.0 else "Soil type not ideal")
        why.append("Sowing window matches" if sow_fit == 1.0 else "Outside sowing window")
        why.append("NPK aligned" if npk_align >= 0.8 else ("NPK partly aligned" if npk_align >= 0.5 else "NPK not aligned"))
        if last_family:
            why.append("Rotation benefit" if rotation > 0 else "Rotation penalty")

        results.append({
            "crop": row["crop"],
            "suitability": suitability,
            "expected_yield_kg": round(yield_kg, 0),
            "expected_revenue_inr": round(revenue, 0),
            "expected_cost_inr": round(cost, 0),
            "expected_profit_inr": round(profit, 0),
            "why": why
        })

    # sort by suitability then profit
    results.sort(key=lambda x: (x["suitability"], x["expected_profit_inr"]), reverse=True)
    top_crop = results[0]["crop"]

    # fertilizer plan for the top crop
    plan = fertilizers[fertilizers["crop"] == top_crop].copy()
    # (optional) order stages in a readable flow
    stage_order = {"seed_treatment":0, "basal":1, "top_dressing_1":2, "top_dressing_2":3, "flowering":4, "split_N":5, "foliar":6}
    plan["stage_order"] = plan["stage"].map(lambda s: stage_order.get(str(s), 99))
    plan = plan.sort_values(by=["stage_order"]).drop(columns=["stage_order"])
    fert_plan = plan.to_dict(orient="records")

    return {
        "recommendations": results[:3],
        "fertilizer_plan": fert_plan
    }
