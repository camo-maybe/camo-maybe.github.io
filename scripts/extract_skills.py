import pandas as pd
import json
import os
from datetime import datetime

# Paths
EXCEL_PATH = r"c:\work\tmp\skills.xlsx"
OUTPUT_SKILLS = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\skills.json"
OUTPUT_EXP = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\experience.json"
OUTPUT_STATS = r"c:\work\10.workspaces\camo-maybe.github.io\src\data\stats.json"
NOW = datetime(2026, 3, 1)

FE_SKILLS = ["TypeScript", "JavaScript", "HTML", "CSS", "Angular", "React", "Next.js", "Tailwind CSS", "Ionic", "Swift", "Xamarin"]
BE_SKILLS = ["Python", "Java", "C#", "FastAPI", "Django", "Spring", "SAStruts", "AWS MySQL", "DynamoDB", "OpenSearch", "SQL Server 2016", "Oracle 12c", "Oracle 12cr2", "DB2", "MongoDB"]

def parse_date(date_str):
    if pd.isna(date_str) or not str(date_str).strip() or str(date_str) == "/":
        return None
    date_str = str(date_str).strip()
    try:
        return datetime.strptime(date_str, "%Y/%m")
    except ValueError:
        try:
             return pd.to_datetime(date_str)
        except:
            return None

def normalize_skill(skill):
    skill = str(skill).strip().replace("\n", " ").replace("/", " ")
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
            
            no_val = row.iloc[1]
            if not pd.isna(no_val) and str(no_val).isdigit():
                if current_proj:
                    all_projects.append(current_proj)
                
                proj_name_raw = str(row.iloc[4]).strip() if not pd.isna(row.iloc[4]) else ""
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
                    "name": proj_name_raw.split("\n")[0] if proj_name_raw else "Unknown Project",
                    "description": "\n".join(proj_name_raw.split("\n")[1:]) if proj_name_raw else "",
                    "role": role_raw.split("\n")[0] if role_raw else "",
                    "isLeader": False,
                    "skills": list(set(skills)),
                    "type": "Professional",
                    "full_text": proj_name_raw + " " + role_raw + " " + str(row.values)
                }

            if not current_proj: continue

            if current_proj["date"] is None:
                date = parse_date(row.iloc[2])
                if date:
                    current_proj["date"] = date
            
            row_name = str(row.iloc[4]).strip() if not pd.isna(row.iloc[4]) else ""
            row_role = str(row.iloc[23]).strip() if not pd.isna(row.iloc[23]) else ""
            if row_name or row_role:
                current_proj["full_text"] += " " + row_name + " " + row_role

            cols = [27, 32, 41]
            for col in cols:
                val = row.iloc[col]
                if not pd.isna(val) and str(val).strip() and "●" not in str(val):
                    parts = str(val).replace("\n", "/").split("/")
                    new_skills = [normalize_skill(p) for p in parts if p.strip()]
                    current_proj["skills"] = list(set(current_proj["skills"] + new_skills))

        if current_proj:
            all_projects.append(current_proj)

    final_projects = [p for p in all_projects if p["date"]]
    final_projects.sort(key=lambda x: x["date"])

    skill_months = {}
    experience_data = []
    stats = {
        "methodology": {"Agile": 0, "Waterfall": 0},
        "vcs": {"Git": 0, "SVN": 0},
        "stack": {"Frontend": 0, "Backend": 0}
    }

    for i in range(len(final_projects)):
        cur = final_projects[i]
        start = cur["date"]
        end = final_projects[i+1]["date"] if i+1 < len(final_projects) else NOW
        months = (end.year - start.year) * 12 + (end.month - start.month)
        if months <= 0: months = 1

        for s in cur["skills"]:
            if s and s != "-":
                skill_months[s] = skill_months.get(s, 0) + months
        
        # Stats Aggregation
        txt = cur["full_text"].lower()
        # Methodology
        if "アジャイル" in txt: stats["methodology"]["Agile"] += months
        elif "ウォーターフォール" in txt: stats["methodology"]["Waterfall"] += months
        
        # VCS
        if "git" in txt: stats["vcs"]["Git"] += months
        elif "svn" in txt or "subversion" in txt or "tortise" in txt: stats["vcs"]["SVN"] += months
        
        # Stack
        is_fe = any(s in FE_SKILLS for s in cur["skills"]) or "フロント" in txt
        is_be = any(s in BE_SKILLS for s in cur["skills"]) or "バック" in txt
        if is_fe and is_be:
            stats["stack"]["Frontend"] += months // 2
            stats["stack"]["Backend"] += months // 2
        elif is_fe:
            stats["stack"]["Frontend"] += months
        elif is_be:
            stats["stack"]["Backend"] += months

        # Leader Detection
        leadership_keywords = ["リーダー", "Lead", "リーダ", "主導", "PL", "TL", "サブリーダー", "管理", "マネジメント"]
        if any(k.lower() in txt for k in leadership_keywords):
            cur["isLeader"] = True
            
        exp_item = cur.copy()
        exp_item["date"] = start.strftime("%Y/%m")
        exp_item["endDate"] = end.strftime("%Y/%m") if i+1 < len(final_projects) else "Present"
        exp_item["duration"] = months
        del exp_item["full_text"]
        experience_data.append(exp_item)

    # Save outputs
    os.makedirs(os.path.dirname(OUTPUT_SKILLS), exist_ok=True)
    with open(OUTPUT_SKILLS, "w", encoding="utf-8") as f:
        json.dump(skill_months, f, ensure_ascii=False, indent=2)
    with open(OUTPUT_EXP, "w", encoding="utf-8") as f:
        json.dump(experience_data[::-1], f, ensure_ascii=False, indent=2)
    with open(OUTPUT_STATS, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    
    print(f"Success! Saved skills, experience, and stats.")

if __name__ == "__main__":
    process()
