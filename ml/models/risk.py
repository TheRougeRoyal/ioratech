from __future__ import annotations

import numpy as np
from pydantic import BaseModel
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler


class RiskRequest(BaseModel):
    emissions_scope1: float
    emissions_scope2: float
    emissions_scope3: float
    energy_consumption: float
    industry_sector: str = "manufacturing"
    company_size: int = 500
    region: str = "global"


class RiskCategory(BaseModel):
    name: str
    score: float
    level: str


class RiskResult(BaseModel):
    overall_score: float
    level: str
    categories: list[RiskCategory]
    top_risk: str
    recommendations: list[str]


def _generate_training_data(n: int = 500) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.RandomState(42)

    s1 = rng.uniform(500, 50000, n)
    s2 = rng.uniform(1000, 80000, n)
    s3 = rng.uniform(2000, 200000, n)
    energy = rng.uniform(500, 500000, n)
    size = rng.uniform(10, 10000, n)

    total = s1 + s2 + s3
    intensity = total / (energy + 1)
    size_factor = np.log1p(size) / 10

    risk_raw = (
        0.3 * (total / 300000)
        + 0.25 * (intensity / 5)
        + 0.15 * (s3 / (total + 1))
        + 0.15 * size_factor
        + 0.15 * rng.normal(0.5, 0.15, n)
    )

    X = np.column_stack([s1, s2, s3, energy, size, intensity, size_factor])
    y = (risk_raw > 0.5).astype(int)

    return X, y


_model = None
_scaler = None


def _get_model():
    global _model, _scaler
    if _model is not None:
        return _model, _scaler

    X, y = _generate_training_data()

    _scaler = StandardScaler()
    X_scaled = _scaler.fit_transform(X)

    _model = GradientBoostingClassifier(
        n_estimators=50,
        max_depth=3,
        learning_rate=0.1,
        random_state=42,
    )
    _model.fit(X_scaled, y)

    return _model, _scaler


def _categorize(score: float) -> str:
    if score >= 70:
        return "high"
    if score >= 40:
        return "medium"
    return "low"


def _compute_category_scores(req: RiskRequest) -> list[RiskCategory]:
    total = req.emissions_scope1 + req.emissions_scope2 + req.emissions_scope3

    categories = [
        RiskCategory(
            name="Carbon Exposure",
            score=round(min(100, (total / 300000) * 100), 1),
            level="",
        ),
        RiskCategory(
            name="Energy Intensity",
            score=round(min(100, (total / (req.energy_consumption + 1)) * 20), 1),
            level="",
        ),
        RiskCategory(
            name="Supply Chain Risk",
            score=round(min(100, (req.emissions_scope3 / (total + 1)) * 100), 1),
            level="",
        ),
        RiskCategory(
            name="Regulatory Risk",
            score=round(min(100, 40 + req.company_size / 200), 1),
            level="",
        ),
    ]

    for cat in categories:
        cat.level = _categorize(cat.score)

    return categories


def _get_recommendations(categories: list[RiskCategory], total: float) -> list[str]:
    recs = []
    sorted_cats = sorted(categories, key=lambda c: c.score, reverse=True)
    top = sorted_cats[0]

    recommendations_map = {
        "Carbon Exposure": "Set science-based targets and implement emissions reduction roadmap",
        "Energy Intensity": "Accelerate renewable energy procurement and energy efficiency programs",
        "Supply Chain Risk": "Engage top suppliers on Scope 3 disclosure and set procurement standards",
        "Regulatory Risk": "Prepare for upcoming climate disclosure requirements (CSRD, SEC rules)",
    }

    recs.append(recommendations_map.get(top.name, "Review climate strategy"))

    if total > 100000:
        recs.append("Consider carbon offset programs for residual emissions")
    if any(c.level == "high" for c in categories):
        recs.append("Prioritize immediate action on highest-scoring risk category")

    return recs[:3]


def predict_risk(req: RiskRequest) -> RiskResult:
    model, scaler = _get_model()

    total = req.emissions_scope1 + req.emissions_scope2 + req.emissions_scope3
    intensity = total / (req.energy_consumption + 1)
    size_factor = np.log1p(req.company_size) / 10

    X = np.array([[
        req.emissions_scope1,
        req.emissions_scope2,
        req.emissions_scope3,
        req.energy_consumption,
        req.company_size,
        intensity,
        size_factor,
    ]])

    X_scaled = scaler.transform(X)
    prob = model.predict_proba(X_scaled)[0][1]

    score = round(prob * 100, 1)
    categories = _compute_category_scores(req)
    top_cat = max(categories, key=lambda c: c.score)

    return RiskResult(
        overall_score=score,
        level=_categorize(score),
        categories=categories,
        top_risk=top_cat.name,
        recommendations=_get_recommendations(categories, total),
    )
