import pandas as pd
import json
import os
from datetime import datetime

# Paths
EXCEL_PATH = r"c:\work\tmp\skills.xlsx"
OUTPUT_SKILLS = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\skills.json"
OUTPUT_EXP = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\experience.json"
NOW = datetime(2026, 3, 1)

def parse_date(date_str):
    if pd.isna(date_str) or not str(date_str).strip() or str(date_str) == "/":
        return None
    date_str = str(date_str).strip()
    try:
        # Handle formats: 2025/11, 2025/09, 2023/3
        return datetime.strptime(date_str, "%Y/%m")
    except ValueError:
        try:
             # Handle weird Excel dates or 2025/3/1
             return pd.to_datetime(date_str)
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
            
            # Extract content
            proj_name_raw = str(row.iloc[4]).strip() if not pd.isna(row.iloc[4]) else "Unknown Project"
            role_raw = str(row.iloc[23]).strip() if not pd.isna(row.iloc[23]) else ""
            
            skills = []
            if sheet == "開発":
                cols = [27, 32, 41] # Lang/FW, DB, Cloud
            else:
                cols = [27, 32, 41] # Function, Network, Cloud
                
            for col in cols:
                val = row.iloc[col]
                if not pd.isna(val) and str(val).strip():
                    parts = str(val).replace("\n", "/").split("/")
                    skills.extend([normalize_skill(p) for p in parts if p.strip()])

            all_projects.append({
                "date": date,
                "name": proj_name_raw.split("\n")[0], # First line is usually title
                "description": "\n".join(proj_name_raw.split("\n")[1:]),
                "role": role_raw,
                "skills": list(set(skills)),
                "type": "Professional"
            })

    if not all_projects:
        print("No projects found.")
        return

    # Sort projects by date ascending
    all_projects.sort(key=lambda x: x["date"])

    skill_months = {}
    experience_data = []

    for i in range(len(all_projects)):
        cur = all_projects[i]
        start = cur["date"]
        # End date is next project start OR Now
        end = all_projects[i+1]["date"] if i+1 < len(all_projects) else NOW
        
        # Duration in months (approx)
        months = (end.year - start.year) * 12 + (end.month - start.month)
        if months <= 0: months = 1

        for s in cur["skills"]:
            skill_months[s] = skill_months.get(s, 0) + months
        
        # Prepare for JSON
        exp_item = cur.copy()
        exp_item["date"] = start.strftime("%Y/%m")
        exp_item["endDate"] = end.strftime("%Y/%m") if i+1 < len(all_projects) else "Present"
        exp_item["duration"] = months
        experience_data.append(exp_item)

    # Save Skills
    os.makedirs(os.path.dirname(OUTPUT_SKILLS), exist_ok=True)
    with open(OUTPUT_SKILLS, "w", encoding="utf-8") as f:
        json.dump(skill_months, f, ensure_ascii=False, indent=2)
    
    # Save Experience (Reverse chronological for UI)
    experience_data.reverse()
    with open(OUTPUT_EXP, "w", encoding="utf-8") as f:
        json.dump(experience_data, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Saved {len(skill_months)} skills and {len(experience_data)} projects.")

if __name__ == "__main__":
    process()
