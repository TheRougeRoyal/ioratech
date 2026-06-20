from __future__ import annotations

import numpy as np
from pydantic import BaseModel
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler


class ForecastRequest(BaseModel):
    historical: list[float]
    periods: int = 12
    confidence: float = 0.95


class ForecastResult(BaseModel):
    predictions: list[float]
    lower_bound: list[float]
    upper_bound: list[float]
    trend: str
    avg_change_pct: float


def _build_features(values: list[float]) -> np.ndarray:
    n = len(values)
    X = np.arange(n).reshape(-1, 1)
    return X


def forecast_emissions(req: ForecastRequest) -> ForecastResult:
    values = np.array(req.historical, dtype=float)
    n = len(values)

    if n < 3:
        mean = float(np.mean(values))
        preds = [mean] * req.periods
        return ForecastResult(
            predictions=preds,
            lower_bound=[v * 0.9 for v in preds],
            upper_bound=[v * 1.1 for v in preds],
            trend="stable",
            avg_change_pct=0.0,
        )

    X = _build_features(values)
    y = values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = Ridge(alpha=1.0)
    model.fit(X_scaled, y)

    future_X = np.arange(n, n + req.periods).reshape(-1, 1)
    future_X_scaled = scaler.transform(future_X)

    preds = model.predict(future_X_scaled)

    residuals = y - model.predict(X_scaled)
    std = float(np.std(residuals))
    z = 1.96 if req.confidence >= 0.95 else 1.64

    lower = (preds - z * std).tolist()
    upper = (preds + z * std).tolist()

    first_half = float(np.mean(values[: n // 2]))
    second_half = float(np.mean(values[n // 2 :]))
    pct_change = ((second_half - first_half) / first_half * 100) if first_half else 0

    if pct_change < -3:
        trend = "decreasing"
    elif pct_change > 3:
        trend = "increasing"
    else:
        trend = "stable"

    return ForecastResult(
        predictions=[round(v, 2) for v in preds.tolist()],
        lower_bound=[round(v, 2) for v in lower],
        upper_bound=[round(v, 2) for v in upper],
        trend=trend,
        avg_change_pct=round(pct_change, 2),
    )
