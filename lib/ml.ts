const ML_API = process.env.NEXT_PUBLIC_ML_API || "http://localhost:8000";

async function mlPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${ML_API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`ML service error (${res.status}): ${text}`);
  }

  return res.json();
}

export interface ForecastRequest {
  historical: number[];
  periods?: number;
  confidence?: number;
}

export interface ForecastResult {
  predictions: number[];
  lower_bound: number[];
  upper_bound: number[];
  trend: string;
  avg_change_pct: number;
}

export interface RiskRequest {
  emissions_scope1: number;
  emissions_scope2: number;
  emissions_scope3: number;
  energy_consumption: number;
  industry_sector?: string;
  company_size?: number;
  region?: string;
}

export interface RiskCategory {
  name: string;
  score: number;
  level: string;
}

export interface RiskResult {
  overall_score: number;
  level: string;
  categories: RiskCategory[];
  top_risk: string;
  recommendations: string[];
}

export interface AnomalyRequest {
  data_points: number[][];
  feature_names?: string[];
  contamination?: number;
}

export interface AnomalyPoint {
  index: number;
  values: Record<string, number>;
  is_anomaly: boolean;
  severity: string;
  score: number;
}

export interface AnomalyResult {
  total_points: number;
  anomalies_found: number;
  anomaly_rate: number;
  points: AnomalyPoint[];
  summary: string;
}

export interface ComplianceRequest {
  has_emissions_data?: boolean;
  has_scope1?: boolean;
  has_scope2?: boolean;
  has_scope3?: boolean;
  has_risk_assessment?: boolean;
  has_governance?: boolean;
  has_targets?: boolean;
  has_verification?: boolean;
  has_disclosure?: boolean;
}

export interface ComplianceItem {
  name: string;
  has_data: boolean;
  score: number;
  status: string;
  gap: string | null;
}

export interface ComplianceResult {
  overall_score: number;
  level: string;
  items: ComplianceItem[];
  gaps: string[];
  next_steps: string[];
}

export const ml = {
  forecast: (req: ForecastRequest) =>
    mlPost<ForecastResult>("/ml/forecast", req),

  riskScore: (req: RiskRequest) =>
    mlPost<RiskResult>("/ml/risk-score", req),

  anomalyDetect: (req: AnomalyRequest) =>
    mlPost<AnomalyResult>("/ml/anomaly-detect", req),

  complianceAnalyze: (req: ComplianceRequest) =>
    mlPost<ComplianceResult>("/ml/compliance-analyze", req),

  health: () => fetch(`${ML_API}/ml/health`).then((r) => r.json()),
};
