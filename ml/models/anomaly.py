from __future__ import annotations

import numpy as np
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


class AnomalyRequest(BaseModel):
    data_points: list[list[float]]
    feature_names: list[str] = ["emissions", "energy", "cost"]
    contamination: float = 0.1


class AnomalyPoint(BaseModel):
    index: int
    values: dict[str, float]
    is_anomaly: bool
    severity: str
    score: float


class AnomalyResult(BaseModel):
    total_points: int
    anomalies_found: int
    anomaly_rate: float
    points: list[AnomalyPoint]
    summary: str


_model = None
_scaler = None


def _get_model(n_features: int, contamination: float):
    global _model, _scaler

    rng = np.random.RandomState(42)
    normal = rng.normal(0, 1, (200, n_features))
    anomalies = rng.uniform(-4, 4, (20, n_features))
    X_train = np.vstack([normal, anomalies])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_train)

    model = IsolationForest(
        n_estimators=50,
        contamination=contamination,
        random_state=42,
    )
    model.fit(X_scaled)

    return model, scaler


def _severity(score: float) -> str:
    if score < -0.5:
        return "critical"
    if score < -0.2:
        return "high"
    if score < 0:
        return "medium"
    return "low"


def detect_anomalies(req: AnomalyRequest) -> AnomalyResult:
    if not req.data_points or not req.data_points[0]:
        return AnomalyResult(
            total_points=0,
            anomalies_found=0,
            anomaly_rate=0.0,
            points=[],
            summary="No data provided",
        )

    n_features = len(req.data_points[0])
    feature_names = req.feature_names[:n_features]

    model, scaler = _get_model(n_features, req.contamination)

    X = np.array(req.data_points, dtype=float)
    X_scaled = scaler.transform(X)

    preds = model.predict(X_scaled)
    scores = model.decision_function(X_scaled)

    points = []
    for i, (pred, score) in enumerate(zip(preds, scores)):
        is_anomaly = pred == -1
        values = {name: round(float(X[i][j]), 2) for j, name in enumerate(feature_names)}

        points.append(AnomalyPoint(
            index=i,
            values=values,
            is_anomaly=is_anomaly,
            severity=_severity(float(score)) if is_anomaly else "normal",
            score=round(float(score), 4),
        ))

    anomalies = [p for p in points if p.is_anomaly]
    rate = len(anomalies) / len(points) * 100 if points else 0

    if len(anomalies) == 0:
        summary = "No anomalies detected in the dataset"
    elif rate < 5:
        summary = f"Low anomaly rate ({rate:.1f}%) — dataset appears stable"
    elif rate < 15:
        summary = f"Moderate anomaly rate ({rate:.1f}%) — some data points warrant investigation"
    else:
        summary = f"High anomaly rate ({rate:.1f}%) — significant data quality or operational issues"

    return AnomalyResult(
        total_points=len(points),
        anomalies_found=len(anomalies),
        anomaly_rate=round(rate, 1),
        points=points,
        summary=summary,
    )
