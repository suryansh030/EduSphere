# internship_data.py
import os
import re
import ast
from functools import lru_cache
from typing import List, Dict

import pandas as pd

# Path to your CSV (relative to this file)
CSV_PATH = os.path.join(os.path.dirname(__file__), "internships.csv")


def _parse_skills_cell(cell: str) -> List[str]:
    """
    Skills cells look like "['Content Writing', 'MS-Excel', 'Canva']".
    This converts them to: ["content writing", "ms-excel", "canva"].
    """
    if pd.isna(cell):
        return []

    text = str(cell).strip()

    # Try to read it as a Python list string: ['A', 'B']
    try:
        parsed = ast.literal_eval(text)
        if isinstance(parsed, (list, tuple)):
            return [str(s).strip().lower() for s in parsed if str(s).strip()]
    except Exception:
        pass

    # Fallback: split by comma/semicolon
    parts = re.split(r"[;,/|]", text)
    return [p.strip().lower() for p in parts if p.strip()]


def _parse_stipend(cell: str) -> float:
    """
    Stipend examples: '₹7,000-1 /month', '₹10,000 /month', etc.
    We try to extract the FIRST number as minimum monthly stipend.
    If not parseable, return 0.
    """
    if pd.isna(cell):
        return 0.0

    text = str(cell)
    # Find all number groups like 7,000 or 10000
    nums = re.findall(r"\d[\d,]*", text)
    if not nums:
        return 0.0

    # Take first number and remove commas
    first = nums[0].replace(",", "")
    try:
        return float(first)
    except ValueError:
        return 0.0


@lru_cache(maxsize=1)
def load_internships_df() -> pd.DataFrame:
    """
    Load and preprocess the internships CSV once.
    Column names in your screenshot:
    Internship Id | Role | Company Name | Location | Duration | Stipend | Intern Type | Skills | ...
    """
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found at {CSV_PATH}")

    # Encoding 'utf-8' usually works; if you see errors, use errors="ignore"
    df = pd.read_csv(CSV_PATH, encoding="utf-8")

    # Normalize column names -> lower_case_with_underscores
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # Ensure important columns exist
    required = ["role", "skills", "stipend"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"CSV must have a '{col}' column. Found: {df.columns}")

    # Parse skills column into lists
    df["skill_list"] = df["skills"].apply(_parse_skills_cell)

    # Parse stipend into numeric
    df["stipend_value"] = df["stipend"].apply(_parse_stipend)

    # Normalized role field for searching
    df["role_norm"] = df["role"].fillna("").str.lower()

    return df


def _skill_frequency(df: pd.DataFrame) -> Dict[str, int]:
    """
    Count how many internships mention each skill.
    """
    counts: Dict[str, int] = {}
    for skills in df["skill_list"]:
        for s in skills:
            counts[s] = counts.get(s, 0) + 1
    return counts


def _filter_by_role(df: pd.DataFrame, target_role: str | None) -> pd.DataFrame:
    """
    Filter internships by role keyword if provided.
    If no rows match, return the full dataframe so we still use the dataset.
    """
    if not target_role:
        return df
    key = target_role.lower().strip()
    df_role = df[df["role_norm"].str.contains(key, na=False)]
    # If no direct match, use all roles instead of empty
    return df_role if not df_role.empty else df


def get_trending_skills(
    target_role: str | None = None,
    top_n: int = 25,
) -> List[dict]:
    """
    Trending skills = most frequent skills in internships (optionally for a specific role).
    Returns list of { "skill": <str>, "count": <int> }.
    """
    df = load_internships_df()
    df_role = _filter_by_role(df, target_role)
    print("[TREND DEBUG]", "target_role:", target_role, "rows:", len(df_role))
    if df_role.empty:
        return []

    counts = _skill_frequency(df_role)
    ranked = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"skill": s, "count": int(c)} for s, c in ranked]


def get_high_stipend_skills(
    target_role: str | None = None,
    percentile: float = 0.8,
    top_n: int = 15,
) -> List[dict]:
    """
    High‑stipend skills = most frequent skills among the top X% highest‑stipend internships.
    percentile=0.8 means we keep only internships with stipend >= 80th percentile.
    """
    df = load_internships_df()
    df_role = _filter_by_role(df, target_role)

    if df_role.empty:
        return []

    threshold = df_role["stipend_value"].quantile(percentile)
    df_high = df_role[df_role["stipend_value"] >= threshold]

    if df_high.empty:
        return []

    counts = _skill_frequency(df_high)
    ranked = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"skill": s, "count": int(c)} for s, c in ranked]


def suggest_missing_skills(
    current_skills: List[str],
    target_role: str,
    top_n: int = 20,
) -> List[str]:
    """
    From trending skills, remove ones the user already has. Result = skill gap suggestions.
    """
    current = {s.lower() for s in current_skills}
    trends = get_trending_skills(target_role=target_role, top_n=100)
    missing = [t["skill"] for t in trends if t["skill"] not in current]
    return missing[:top_n]