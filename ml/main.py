from __future__ import annotations

from contextlib import asynccontextmanager
from time import perf_counter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import (
    AnomalyRequest,
    AnomalyResult,
    ComplianceRequest,
    ComplianceResult,
    ForecastRequest,
    ForecastResult,
    RiskRequest,
    RiskResult,
    analyze_compliance,
    detect_anomalies,
    forecast_emissions,
    predict_risk,
)

_start_time = perf_counter()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from models.forecasting import forecast_emissions as _warm1
    from models.risk import _get_model as _warm2
    _get_model = _warm2
    _get_model()
    yield


app = FastAPI(
    title="Iora ML Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ml/health")
async def health():
    uptime = round(perf_counter() - _start_time, 1)
    return {"status": "ok", "uptime_seconds": uptime, "models_loaded": True}


@app.post("/ml/forecast", response_model=ForecastResult)
async def forecast(req: ForecastRequest):
    return forecast_emissions(req)


@app.post("/ml/risk-score", response_model=RiskResult)
async def risk_score(req: RiskRequest):
    return predict_risk(req)


@app.post("/ml/anomaly-detect", response_model=AnomalyResult)
async def anomaly_detect(req: AnomalyRequest):
    return detect_anomalies(req)


@app.post("/ml/compliance-analyze", response_model=ComplianceResult)
async def compliance_analyze(req: ComplianceRequest):
    return analyze_compliance(req)
