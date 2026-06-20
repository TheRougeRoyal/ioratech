from __future__ import annotations

from pydantic import BaseModel


class ComplianceItem(BaseModel):
    name: str
    has_data: bool
    score: float
    status: str
    gap: str | None = None


class ComplianceRequest(BaseModel):
    has_emissions_data: bool = False
    has_scope1: bool = False
    has_scope2: bool = False
    has_scope3: bool = False
    has_risk_assessment: bool = False
    has_governance: bool = False
    has_targets: bool = False
    has_verification: bool = False
    has_disclosure: bool = False


class ComplianceResult(BaseModel):
    overall_score: float
    level: str
    items: list[ComplianceItem]
    gaps: list[str]
    next_steps: list[str]


_WEIGHTS = {
    "Emissions Inventory": 0.20,
    "Scope 1 Data": 0.10,
    "Scope 2 Data": 0.10,
    "Scope 3 Data": 0.15,
    "Risk Assessment": 0.15,
    "Governance": 0.10,
    "Targets & Strategy": 0.10,
    "Third-party Verification": 0.05,
    "Public Disclosure": 0.05,
}

_GAP_TEMPLATES = {
    "Emissions Inventory": "Establish a complete emissions inventory covering all operations",
    "Scope 1 Data": "Collect and report direct emissions from owned/controlled sources",
    "Scope 2 Data": "Account for indirect emissions from purchased electricity, heat, and cooling",
    "Scope 3 Data": "Map and measure value chain emissions across all 15 categories",
    "Risk Assessment": "Conduct climate-related financial risk assessment (physical + transition)",
    "Governance": "Establish board oversight and management's role in climate governance",
    "Targets & Strategy": "Set science-based targets aligned with Paris Agreement",
    "Third-party Verification": "Obtain independent third-party assurance of emissions data",
    "Public Disclosure": "Publish climate-related disclosures in annual/sustainability report",
}


def analyze_compliance(req: ComplianceRequest) -> ComplianceResult:
    field_map = {
        "Emissions Inventory": req.has_emissions_data,
        "Scope 1 Data": req.has_scope1,
        "Scope 2 Data": req.has_scope2,
        "Scope 3 Data": req.has_scope3,
        "Risk Assessment": req.has_risk_assessment,
        "Governance": req.has_governance,
        "Targets & Strategy": req.has_targets,
        "Third-party Verification": req.has_verification,
        "Public Disclosure": req.has_disclosure,
    }

    items = []
    total_score = 0.0

    for name, has_data in field_map.items():
        weight = _WEIGHTS[name]
        if has_data:
            score = 100.0
            status = "aligned"
            gap = None
        else:
            score = 0.0
            status = "missing"
            gap = _GAP_TEMPLATES[name]

        items.append(ComplianceItem(
            name=name,
            has_data=has_data,
            score=round(score * weight, 1),
            status=status,
            gap=gap,
        ))
        total_score += score * weight

    gaps = [item.gap for item in items if item.gap]
    missing_count = sum(1 for item in items if not item.has_data)

    next_steps = []
    priority_items = [item for item in items if not item.has_data][:3]
    for item in priority_items:
        step = _GAP_TEMPLATES.get(item.name, f"Address {item.name}")
        next_steps.append(step)

    if total_score >= 80:
        level = "strong"
    elif total_score >= 50:
        level = "developing"
    else:
        level = "early"

    return ComplianceResult(
        overall_score=round(total_score, 1),
        level=level,
        items=items,
        gaps=gaps,
        next_steps=next_steps,
    )
