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
        
        start_row = -1
        for i, row in df.iterrows():
            if "期間" in str(row.values) and i > 20:
                start_row = i
                break
        
        if start_row == -1: continue

        current_proj = None
        for j in range(start_row + 1, len(df)):
            row = df.iloc[j]
            
            # If we find a new project number, save the old one and start new
            no_val = row.iloc[1]
            if not pd.isna(no_val) and str(no_val).isdigit():
                if current_proj:
                    all_projects.append(current_proj)
                
                proj_name_raw = str(row.iloc[4]).strip() if not pd.isna(row.iloc[4]) else "Unknown Project"
                role_raw = str(row.iloc[23]).strip() if not pd.isna(row.iloc[23]) else ""
                
                skills = []
                cols = [27, 32, 41]
                for col in cols:
                    val = row.iloc[col]
                    if not pd.isna(val) and str(val).strip():
                        parts = str(val).replace("\n", "/").split("/")
                        skills.extend([normalize_skill(p) for p in parts if p.strip()])

                current_proj = {
                    "date": None,
                    "name": proj_name_raw.split("\n")[0],
                    "description": "\n".join(proj_name_raw.split("\n")[1:]),
                    "role": role_raw,
                    "skills": list(set(skills)),
                    "type": "Professional"
                }

            # If we don't have a date yet for the current project, look for it in this row
            if current_proj and current_proj["date"] is None:
                date = parse_date(row.iloc[2])
                if date:
                    current_proj["date"] = date
            
            # Sometimes skills are also in subsequent rows? Let's check adding them if any
            if current_proj:
                cols = [27, 32, 41]
                for col in cols:
                    val = row.iloc[col]
                    if not pd.isna(val) and str(val).strip() and "●" not in str(val):
                        parts = str(val).replace("\n", "/").split("/")
                        new_skills = [normalize_skill(p) for p in parts if p.strip()]
                        current_proj["skills"] = list(set(current_proj["skills"] + new_skills))

        if current_proj:
            all_projects.append(current_proj)

    # Filter out projects without dates (if any) or use current date for No.1 if it's really missing
    final_projects = []
    for p in all_projects:
        if p["date"]:
            final_projects.append(p)
        else:
            print(f"Skipping project {p['name']} due to missing date.")

    if not final_projects:
        print("No valid projects found.")
        return

    # Sort projects by date ascending
    final_projects.sort(key=lambda x: x["date"])

    skill_months = {}
    experience_data = []

    for i in range(len(final_projects)):
        cur = final_projects[i]
        start = cur["date"]
        end = final_projects[i+1]["date"] if i+1 < len(final_projects) else NOW
        
        months = (end.year - start.year) * 12 + (end.month - start.month)
        if months <= 0: months = 1

        for s in cur["skills"]:
            if s and s != "-":
                skill_months[s] = skill_months.get(s, 0) + months
        
        exp_item = cur.copy()
        exp_item["date"] = start.strftime("%Y/%m")
        exp_item["endDate"] = end.strftime("%Y/%m") if i+1 < len(final_projects) else "Present"
        exp_item["duration"] = months
        experience_data.append(exp_item)

    # Save Skills
    os.makedirs(os.path.dirname(OUTPUT_SKILLS), exist_ok=True)
    with open(OUTPUT_SKILLS, "w", encoding="utf-8") as f:
        json.dump(skill_months, f, ensure_ascii=False, indent=2)
    
    # Save Experience
    experience_data.reverse()
    with open(OUTPUT_EXP, "w", encoding="utf-8") as f:
        json.dump(experience_data, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Saved {len(skill_months)} skills and {len(experience_data)} projects.")

if __name__ == "__main__":
    process()
