import pandas as pd
import json
import os
from datetime import datetime

# Paths
EXCEL_PATH = r"c:\work\tmp\skills.xlsx"
OUTPUT_PATH = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\skills.json"
NOW = datetime(2026, 3, 1)

def parse_date(date_str):
    if pd.isna(date_str) or not str(date_str).strip() or str(date_str) == "/":
        return None
    try:
        # Expected formats: 2025/11, 2025/09, 2023/3
        return datetime.strptime(str(date_str).strip(), "%Y/%m")
    except ValueError:
        try:
            return datetime.strptime(str(date_str).strip(), "%Y/%d") # Fallback if weird
        except:
            return None

def normalize_skill(skill):
    skill = str(skill).strip().replace("\n", " ").replace("/", " ")
    # Basic mapping for known variations
    mapping = {
        "Typescript": "TypeScript",
        "Javascript": "JavaScript",
        "C#.NET": "C#",
        "AWS RDS(MySQL)": "AWS MySQL",
        "EC2(Ubuntu)": "AWS EC2",
    }
    return mapping.get(skill, skill)

def process():
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: {EXCEL_PATH} not found.")
        return

    all_projects = []
    xl = pd.ExcelFile(EXCEL_PATH)

    for sheet in xl.sheet_names:
        if sheet not in ["インフラ", "開発"]: continue
        df = pd.read_excel(EXCEL_PATH, sheet_name=sheet)
        
        # Find start of project table
        start_row = -1
        for i, row in df.iterrows():
            if "期間" in str(row.values) and i > 20:
                start_row = i
                break
        
        if start_row == -1: continue

        for j in range(start_row + 1, len(df)):
            row = df.iloc[j]
            if pd.isna(row.iloc[1]): continue # No No. field
            
            date = parse_date(row.iloc[2])
            if not date: continue
            
            skills = []
            # '開発' columns
            if sheet == "開発":
                for col in [27, 32, 41]: # Lang/FW, DB, Server/Cloud
                    val = row.iloc[col]
                    if not pd.isna(val) and str(val).strip():
                        # Split by slash or newline
                        parts = str(val).replace("\n", "/").split("/")
                        skills.extend([normalize_skill(p) for p in parts if p.strip()])
            else:
                # 'インフラ' columns
                for col in [27, 32, 41]: # Functional, Network, Server/Cloud
                    val = row.iloc[col]
                    if not pd.isna(val) and str(val).strip():
                        parts = str(val).replace("\n", "/").split("/")
                        skills.extend([normalize_skill(p) for p in parts if p.strip()])

            all_projects.append({
                "date": date,
                "skills": list(set(skills))
            })

    if not all_projects:
        print("No projects found.")
        return

    # Sort projects by date ascending
    all_projects.sort(key=lambda x: x["date"])

    skill_months = {}

    for i in range(len(all_projects)):
        cur = all_projects[i]
        start = cur["date"]
        # End date is next project start OR Now
        end = all_projects[i+1]["date"] if i+1 < len(all_projects) else NOW
        
        # Duration in months (approx)
        months = (end.year - start.year) * 12 + (end.month - start.month)
        if months <= 0: months = 1 # Minimum 1 month

        for s in cur["skills"]:
            skill_months[s] = skill_months.get(s, 0) + months

    # Save to JSON
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(skill_months, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Saved {len(skill_months)} skills to {OUTPUT_PATH}")

if __name__ == "__main__":
    process()
