import google.generativeai as genai
import requests
from github import Github
import os
import json
import re
from bs4 import BeautifulSoup
import base64
import time
import threading

# ---------------- API Keys ---------------- #
# ---------------- API Keys from OS Environment ---------------- #

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")

if not GOOGLE_API_KEY:
    print("❌ GOOGLE_API_KEY not set in environment variables")

if not GITHUB_TOKEN:
    print("❌ GITHUB_TOKEN not set in environment variables")


genai.configure(api_key=GOOGLE_API_KEY)

if not GOOGLE_API_KEY:
    print("❌ GOOGLE_API_KEY is missing!")

if not GITHUB_TOKEN:
    print("❌ GITHUB_TOKEN is missing!")


# ===================== SKILL CANONICALIZATION SYSTEM ===================== #
# Maps lowercase skill names to their canonical (properly formatted) versions

CANONICAL_SKILL_NAMES = {
    # Programming Languages
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "c": "C",
    "go": "Go",
    "golang": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "php": "PHP",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "scala": "Scala",
    "r": "R",
    "perl": "Perl",
    "dart": "Dart",
    "lua": "Lua",
    "shell": "Shell",
    "bash": "Bash",
    "powershell": "PowerShell",
    
    # Web Technologies
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "sass": "Sass",
    "scss": "SCSS",
    "less": "Less",
    
    # Frontend Frameworks
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "vue": "Vue",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "angular": "Angular",
    "angularjs": "Angular",
    "svelte": "Svelte",
    "next": "Next.js",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nuxt": "Nuxt.js",
    "nuxtjs": "Nuxt.js",
    "nuxt.js": "Nuxt.js",
    "gatsby": "Gatsby",
    "ember": "Ember.js",
    "emberjs": "Ember.js",
    
    # CSS Frameworks
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "bulma": "Bulma",
    "materialize": "Materialize",
    "material-ui": "Material-UI",
    "materialui": "Material-UI",
    "mui": "Material-UI",
    "chakra": "Chakra UI",
    "chakra ui": "Chakra UI",
    "chakraui": "Chakra UI",
    "styled-components": "Styled Components",
    "styled components": "Styled Components",
    
    # Backend Frameworks
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express",
    "expressjs": "Express",
    "express.js": "Express",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "spring": "Spring",
    "springboot": "Spring Boot",
    "spring boot": "Spring Boot",
    "rails": "Ruby on Rails",
    "ruby on rails": "Ruby on Rails",
    "ror": "Ruby on Rails",
    "laravel": "Laravel",
    "symfony": "Symfony",
    "asp.net": "ASP.NET",
    "aspnet": "ASP.NET",
    ".net": ".NET",
    "dotnet": ".NET",
    "nestjs": "NestJS",
    "nest.js": "NestJS",
    "koa": "Koa",
    "hapi": "Hapi",
    
    # Mobile Development
    "react native": "React Native",
    "reactnative": "React Native",
    "react-native": "React Native",
    "flutter": "Flutter",
    "ionic": "Ionic",
    "xamarin": "Xamarin",
    "android": "Android",
    "ios": "iOS",
    
    # Databases
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    "oracle": "Oracle",
    "sql server": "SQL Server",
    "mssql": "SQL Server",
    "mariadb": "MariaDB",
    "cassandra": "Cassandra",
    "couchdb": "CouchDB",
    "dynamodb": "DynamoDB",
    "firebase": "Firebase",
    "firestore": "Firestore",
    "neo4j": "Neo4j",
    "elasticsearch": "Elasticsearch",
    "sql": "SQL",
    "nosql": "NoSQL",
    
    # ORMs
    "mongoose": "Mongoose",
    "sequelize": "Sequelize",
    "prisma": "Prisma",
    "sqlalchemy": "SQLAlchemy",
    "typeorm": "TypeORM",
    "hibernate": "Hibernate",
    
    # Cloud & DevOps
    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "google cloud": "GCP",
    "google cloud platform": "GCP",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "jenkins": "Jenkins",
    "circleci": "CircleCI",
    "travis": "Travis CI",
    "travisci": "Travis CI",
    "github actions": "GitHub Actions",
    "gitlab ci": "GitLab CI",
    "terraform": "Terraform",
    "ansible": "Ansible",
    "nginx": "Nginx",
    "apache": "Apache",
    "linux": "Linux",
    "ubuntu": "Ubuntu",
    "heroku": "Heroku",
    "vercel": "Vercel",
    "netlify": "Netlify",
    "digitalocean": "DigitalOcean",
    
    # Version Control
    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",
    "bitbucket": "Bitbucket",
    "svn": "SVN",
    
    # Testing
    "jest": "Jest",
    "mocha": "Mocha",
    "chai": "Chai",
    "jasmine": "Jasmine",
    "cypress": "Cypress",
    "selenium": "Selenium",
    "puppeteer": "Puppeteer",
    "playwright": "Playwright",
    "pytest": "Pytest",
    "unittest": "unittest",
    "junit": "JUnit",
    "rspec": "RSpec",
    
    # Data Science & ML
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "keras": "Keras",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "matplotlib": "Matplotlib",
    "seaborn": "Seaborn",
    "jupyter": "Jupyter",
    "opencv": "OpenCV",
    "nltk": "NLTK",
    "spacy": "SpaCy",
    
    # API & Protocols
    "rest": "REST",
    "restful": "REST",
    "graphql": "GraphQL",
    "grpc": "gRPC",
    "websocket": "WebSocket",
    "websockets": "WebSocket",
    "soap": "SOAP",
    
    # Other Tools
    "webpack": "Webpack",
    "babel": "Babel",
    "vite": "Vite",
    "rollup": "Rollup",
    "parcel": "Parcel",
    "gulp": "Gulp",
    "grunt": "Grunt",
    "npm": "npm",
    "yarn": "Yarn",
    "pnpm": "pnpm",
    "redux": "Redux",
    "mobx": "MobX",
    "zustand": "Zustand",
    "recoil": "Recoil",
    "rxjs": "RxJS",
    "socket.io": "Socket.IO",
    "socketio": "Socket.IO",
    "jwt": "JWT",
    "oauth": "OAuth",
    "oauth2": "OAuth 2.0",
    "stripe": "Stripe",
    "twilio": "Twilio",
    "sendgrid": "SendGrid",
    "figma": "Figma",
    "sketch": "Sketch",
    "adobe xd": "Adobe XD",
    "photoshop": "Photoshop",
    "illustrator": "Illustrator",
    "jira": "Jira",
    "confluence": "Confluence",
    "slack": "Slack",
    "trello": "Trello",
    "notion": "Notion",
    "agile": "Agile",
    "scrum": "Scrum",
    "kanban": "Kanban",
}


def normalize_skill_name(skill_name):
    """Normalize skill names for case-insensitive comparison"""
    if not skill_name:
        return ""
    return skill_name.strip().lower()


def canonicalize_skill_name(skill_name):
    """
    Convert a skill name to its canonical (properly formatted) version.
    E.g., 'html' -> 'HTML', 'react' -> 'React', 'javascript' -> 'JavaScript'
    """
    if not skill_name:
        return skill_name
    
    normalized = normalize_skill_name(skill_name)
    
    # Check if we have a canonical name for this skill
    if normalized in CANONICAL_SKILL_NAMES:
        return CANONICAL_SKILL_NAMES[normalized]
    
    # If not in our dictionary, apply smart capitalization
    # Keep all uppercase if it looks like an acronym (2-4 chars, all letters)
    if len(skill_name) <= 4 and skill_name.isalpha():
        return skill_name.upper()
    
    # Title case for other skills
    return skill_name.strip().title()


def find_skill_key(skills_dict, target_skill):
    """Find a skill key in dictionary (case-insensitive)"""
    target_normalized = normalize_skill_name(target_skill)
    for key in skills_dict.keys():
        if normalize_skill_name(key) == target_normalized:
            return key
    return None


def skills_match(skill1, skill2):
    """Check if two skill names match (case-insensitive, handles variations)"""
    norm1 = normalize_skill_name(skill1)
    norm2 = normalize_skill_name(skill2)
    
    # Direct match
    if norm1 == norm2:
        return True
    
    # Check if they canonicalize to the same thing
    canon1 = normalize_skill_name(canonicalize_skill_name(skill1))
    canon2 = normalize_skill_name(canonicalize_skill_name(skill2))
    
    if canon1 == canon2:
        return True
    
    # Check partial matches for compound names
    if norm1 in norm2 or norm2 in norm1:
        return True
    
    return False


# ===================== SKILL DEPENDENCY GRAPH WITH DIFFICULTY-BASED BOOST ===================== #

SKILL_DEPENDENCIES = {
    # Frontend Frameworks → Core Skills (with difficulty-based boosts)
    "React": {
        "dependencies": {
            "JavaScript": 0.60,
            "HTML": 0.90,
            "CSS": 0.85
        }
    },
    "Vue": {
        "dependencies": {
            "JavaScript": 0.60,
            "HTML": 0.90,
            "CSS": 0.85
        }
    },
    "Angular": {
        "dependencies": {
            "JavaScript": 0.55,
            "TypeScript": 0.70,
            "HTML": 0.90,
            "CSS": 0.85
        }
    },
    "Next.js": {
        "dependencies": {
            "React": 0.75,
            "JavaScript": 0.60,
            "HTML": 0.90,
            "CSS": 0.85
        }
    },
    "Svelte": {
        "dependencies": {
            "JavaScript": 0.60,
            "HTML": 0.90,
            "CSS": 0.85
        }
    },
    
    # Backend Frameworks → Core Skills
    "Django": {
        "dependencies": {
            "Python": 0.70
        }
    },
    "Flask": {
        "dependencies": {
            "Python": 0.75
        }
    },
    "FastAPI": {
        "dependencies": {
            "Python": 0.75
        }
    },
    "Express": {
        "dependencies": {
            "JavaScript": 0.70,
            "Node.js": 0.80
        }
    },
    "Spring": {
        "dependencies": {
            "Java": 0.65
        }
    },
    "Spring Boot": {
        "dependencies": {
            "Java": 0.65,
            "Spring": 0.75
        }
    },
    
    # Mobile Development
    "React Native": {
        "dependencies": {
            "React": 0.80,
            "JavaScript": 0.65
        }
    },
    "Flutter": {
        "dependencies": {
            "Dart": 0.75
        }
    },
    "Swift": {
        "dependencies": {
            "iOS": 0.80
        }
    },
    "Kotlin": {
        "dependencies": {
            "Java": 0.60,
            "Android": 0.80
        }
    },
    
    # TypeScript → JavaScript
    "TypeScript": {
        "dependencies": {
            "JavaScript": 0.85
        }
    },
    
    # Node.js → JavaScript
    "Node.js": {
        "dependencies": {
            "JavaScript": 0.80
        }
    },
    
    # CSS Frameworks/Tools
    "Sass": {
        "dependencies": {
            "CSS": 0.85
        }
    },
    "SCSS": {
        "dependencies": {
            "CSS": 0.85
        }
    },
    "Tailwind CSS": {
        "dependencies": {
            "CSS": 0.80,
            "HTML": 0.90
        }
    },
    "Bootstrap": {
        "dependencies": {
            "CSS": 0.85,
            "HTML": 0.90
        }
    },
    
    # Testing Frameworks
    "Jest": {
        "dependencies": {
            "JavaScript": 0.55
        }
    },
    "Pytest": {
        "dependencies": {
            "Python": 0.55
        }
    },
    "Mocha": {
        "dependencies": {
            "JavaScript": 0.55
        }
    },
    
    # Data Science / ML
    "TensorFlow": {
        "dependencies": {
            "Python": 0.65
        }
    },
    "PyTorch": {
        "dependencies": {
            "Python": 0.65
        }
    },
    "Pandas": {
        "dependencies": {
            "Python": 0.75
        }
    },
    "NumPy": {
        "dependencies": {
            "Python": 0.75
        }
    },
    
    # Databases with ORMs
    "Mongoose": {
        "dependencies": {
            "MongoDB": 0.80,
            "JavaScript": 0.65
        }
    },
    "SQLAlchemy": {
        "dependencies": {
            "Python": 0.70,
            "SQL": 0.75
        }
    },
    
    # DevOps
    "Docker": {
        "dependencies": {
            "Linux": 0.65
        }
    },
    "Kubernetes": {
        "dependencies": {
            "Docker": 0.75,
            "Linux": 0.60
        }
    }
}


def apply_skill_dependency_boost(skills_data):
    """
    Apply skill dependency graph logic with DIFFICULTY-BASED BOOSTS.
    """
    
    print("\n🔗 Applying Skill Dependency Graph (Difficulty-Based)...")
    
    boosted_skills = {}
    
    # First pass: Copy all existing skills with canonical names
    for skill_name, skill_data in skills_data.items():
        if skill_name not in ["extra_skills_found"]:
            canonical_name = canonicalize_skill_name(skill_name)
            boosted_skills[canonical_name] = skill_data.copy()
    
    # Second pass: Apply dependency boosts (case-insensitive matching)
    for parent_skill, parent_data in list(boosted_skills.items()):
        # Find parent skill in dependency graph (case-insensitive)
        parent_key = None
        for dep_key in SKILL_DEPENDENCIES.keys():
            if skills_match(dep_key, parent_skill):
                parent_key = dep_key
                break
        
        if parent_key:
            parent_proficiency = parent_data.get("ai_proficiency", 0)
            
            if parent_proficiency > 0:
                dependencies = SKILL_DEPENDENCIES[parent_key]["dependencies"]
                
                print(f"  📊 {parent_skill} (prof: {parent_proficiency}) → boosting dependencies")
                
                for dep_skill, boost_percentage in dependencies.items():
                    # Find the dependency skill in boosted_skills (case-insensitive)
                    dep_key_found = None
                    for existing_key in boosted_skills.keys():
                        if skills_match(existing_key, dep_skill):
                            dep_key_found = existing_key
                            break
                    
                    minimum_proficiency = int(parent_proficiency * boost_percentage)
                    
                    # Use canonical name if creating new skill
                    if not dep_key_found:
                        dep_key_found = canonicalize_skill_name(dep_skill)
                        boosted_skills[dep_key_found] = {
                            "total_bytes": 0,
                            "project_count": 0,
                            "projects": [],
                            "ai_proficiency": 0,
                            "ai_reasoning": "Inferred from parent skill"
                        }
                    
                    # Apply boost if current proficiency is lower
                    current_prof = boosted_skills[dep_key_found].get("ai_proficiency", 0)
                    
                    if minimum_proficiency > current_prof:
                        old_prof = current_prof
                        boosted_skills[dep_key_found]["ai_proficiency"] = minimum_proficiency
                        boosted_skills[dep_key_found]["ai_reasoning"] = (
                            f"Boosted from {parent_skill} (difficulty factor: {boost_percentage}) - "
                            f"was {old_prof}, now {minimum_proficiency}"
                        )
                        print(f"    ✅ {dep_key_found}: {old_prof} → {minimum_proficiency} "
                              f"(boost: {int(boost_percentage*100)}%)")
                    else:
                        print(f"    ⏭️  {dep_key_found}: {current_prof} (already sufficient)")
    
    return boosted_skills


# ===================== MAIN FUNCTION ===================== #

def analyze_github_with_ai(github_url):
    try:
        g = Github(GITHUB_TOKEN)

        # Extract data from URL
        url = github_url.rstrip("/").split("/")
        owner, repo_name = url[-2], url[-1]

        repo = g.get_repo(f"{owner}/{repo_name}")
        print(f"\n🔍 Scanning repository: {owner}/{repo_name}")

        skills_evidence = {}
        projects = []
        code_samples = {}

        languages = repo.get_languages()

        # Store basic project data
        projects.append({
            "name": repo.name,
            "description": repo.description or "No description",
            "url": repo.html_url,
            "stars": repo.stargazers_count,
            "forks": repo.forks_count,
            "languages": list(languages.keys()),
            "topics": repo.get_topics(),
            "updated": str(repo.updated_at)
        })

        # Mark language usage for skill confidence (with canonical names)
        for lang, size in languages.items():
            canonical_lang = canonicalize_skill_name(lang)
            skills_evidence.setdefault(canonical_lang, {
                "total_bytes": 0, "project_count": 0, "projects": []
            })
            skills_evidence[canonical_lang]["total_bytes"] += size
            skills_evidence[canonical_lang]["project_count"] += 1
            skills_evidence[canonical_lang]["projects"].append(repo.name)

        # FAST FILE SAMPLE COLLECTION
        try:
            contents = repo.get_contents("")
            for c in contents[:10]:
                if c.type == "file" and c.size < 50000:
                    ext = c.name.split(".")[-1]
                    code = base64.b64decode(c.content).decode("utf-8", "ignore")[:500]
                    code_samples.setdefault(ext, []).append({"file": c.name, "code": code})
        except:
            pass

        # 🚀 FULL WORKING REACT DETECTOR
        MAX_SCAN = 80
        counter = 0

        def mark_react(reason):
            skills_evidence.setdefault("React", {
                "total_bytes": 15000, "project_count": 0, "projects": [repo.name],
                "ai_proficiency": 50, "ai_reasoning": reason
            })
            skills_evidence["React"]["project_count"] += 1

        def scan(path=""):
            nonlocal counter
            if counter > MAX_SCAN:
                return

            try:
                files = repo.get_contents(path)
                for f in files:
                    if f.type == "dir" and f.name.lower() in ["node_modules", "dist", "build", ".next", "public"]:
                        continue

                    if f.type == "file" and f.name.endswith((".jsx", ".js", ".tsx")):
                        code = base64.b64decode(f.content).decode("utf-8", "ignore").lower()
                        counter += 1
                        if "import react" in code or "from 'react'" in code or "usestate" in code or "useeffect" in code:
                            mark_react("React components/hooks detected")

                    if f.type == "file" and f.name == "package.json":
                        data = base64.b64decode(f.content).decode("utf-8", "ignore").lower()
                        if "react" in data:
                            mark_react("React found in package.json")

                    if f.type == "dir" and counter < MAX_SCAN:
                        scan(f.path)

            except:
                pass

        scan()
        print("React Detect:", skills_evidence.get("React", "❌ None found"))

        # Send to Gemini
        print("\n🤖 Running AI skill analysis...")
        results = analyze_code_with_gemini(code_samples, skills_evidence)

        # Apply dependency graph AFTER AI analysis
        results = apply_skill_dependency_boost(results)

        return results, projects

    except Exception as e:
        print("❌ Error:", e)
        return {}, []


# ===================== GEMINI AI SKILL ANALYZER ===================== #
def analyze_code_with_gemini(code_samples, skills):
    short_samples = {k: [{"file": d["file"], "code": d["code"][:200]} for d in v[:1]] for k, v in code_samples.items()}
    
    prompt = f"""
Analyze and estimate skill proficiency based on code. 
Return only JSON like:
{{ "JavaScript": {{ "proficiency":60,"reason":"Clean code" }} }}

Use proper capitalization for skill names (e.g., JavaScript not javascript, HTML not html).

Samples:{json.dumps(short_samples)}
"""

    model = genai.GenerativeModel("gemini-1.5-flash")
    result = {"done": False, "data": None}

    def run():
        try:
            resp = model.generate_content(prompt)
            raw = re.search(r"\{[\s\S]*\}", resp.text)
            if raw:
                result["data"] = json.loads(raw.group())
        except Exception as e:
            print("❌ Gemini error:", e)
        result["done"] = True

    t = threading.Thread(target=run)
    t.start()

    start = time.time()
    while time.time() - start < 10 and not result["done"]:
        time.sleep(0.3)

    parsed = result["data"]
    if not parsed:
        print("⚠ Gemini timeout — using fallback")
        return fallback(skills)

    # Create new skills dict with canonical names
    canonical_skills = {}
    for lang, data in skills.items():
        canonical_name = canonicalize_skill_name(lang)
        canonical_skills[canonical_name] = data.copy()
        
        # Case-insensitive matching with Gemini results
        match = next((k for k in parsed if skills_match(k, lang)), None)
        if match:
            canonical_skills[canonical_name]["ai_proficiency"] = parsed[match].get("proficiency", 40)
            canonical_skills[canonical_name]["ai_reasoning"] = parsed[match].get("reason", "Detected through AI")
        else:
            canonical_skills[canonical_name]["ai_proficiency"] = calc(data)
            canonical_skills[canonical_name]["ai_reasoning"] = "Estimated size & usage"

    canonical_skills["extra_skills_found"] = [k for k in canonical_skills if k not in ["React", "extra_skills_found"]]

    return canonical_skills


# ===================== FALLBACK CALCULATIONS ===================== #
def calc(d):
    return min((d["project_count"] * 12) + (d["total_bytes"] // 9000), 75)


def fallback(sk):
    canonical_skills = {}
    for k, v in sk.items():
        canonical_name = canonicalize_skill_name(k)
        canonical_skills[canonical_name] = v.copy()
        canonical_skills[canonical_name]["ai_proficiency"] = calc(v)
        canonical_skills[canonical_name]["ai_reasoning"] = "Auto fallback estimation"
    return canonical_skills


def calculate_fallback_proficiency(d):
    return min(int(min(d['project_count'] * 10, 40) + min(d['total_bytes'] / 8000, 35)), 80)


def apply_fallback_proficiency(skills):
    for lang in skills:
        skills[lang]["ai_proficiency"] = calculate_fallback_proficiency(skills[lang])
        skills[lang]["ai_reasoning"] = "Fallback based on repo size"
    return skills


# ===================== SKILL PROFICIENCY GENERATOR ===================== #
def generate_skill_proficiency_with_ai(user_skills, github_skills, user_projects, github_projects):
    """Generate detailed skill proficiency using AI analysis - CASE INSENSITIVE"""

    # Canonicalize user skills
    user_skills_canonical = {}
    for s in user_skills:
        canonical = canonicalize_skill_name(s)
        user_skills_canonical[normalize_skill_name(canonical)] = canonical
    
    # Canonicalize github skills
    github_skills_canonical = {}
    for k, v in github_skills.items():
        canonical = canonicalize_skill_name(k)
        github_skills_canonical[canonical] = v

    proficiency_data = {
        'skills': [],
        'unverified_skills': [],
        'verified_skills': [],
        'github_verified_skills': [],
        'claimed_no_evidence_skills': [],
        'extra_detected_skills': [],
        'scale': {
            '0-19': 'Beginner - Just starting out',
            '20-39': 'Elementary - Basic understanding',
            '40-59': 'Intermediate - Comfortable with basics',
            '60-79': 'Advanced - Strong practical knowledge',
            '80-100': 'Expert - Mastery level proficiency'
        }
    }

    # Track processed skills (normalized) to avoid duplicates
    processed_skills = set()

    # ================= USER CLAIMED SKILLS (CASE INSENSITIVE) =================
    for skill in user_skills:
        canonical_skill = canonicalize_skill_name(skill)
        skill_normalized = normalize_skill_name(canonical_skill)
        
        # Skip if already processed
        if skill_normalized in processed_skills:
            continue
        processed_skills.add(skill_normalized)
        
        skill_analysis = {
            'name': canonical_skill,  # Use canonical name
            'proficiency': 0,
            'level': 'Beginner',
            'evidence': [],
            'verified': False,
            'has_github_evidence': False
        }

        # Find match in github_skills (case-insensitive)
        match_key = None
        for gh_skill in github_skills_canonical.keys():
            if skills_match(gh_skill, canonical_skill):
                match_key = gh_skill
                break

        if match_key and match_key in github_skills_canonical:
            g = github_skills_canonical[match_key]
            skill_analysis['proficiency'] = g.get('ai_proficiency', 0)
            skill_analysis['verified'] = True
            skill_analysis['has_github_evidence'] = True
            skill_analysis['evidence'].append(f"✅ Verified in {g['project_count']} GitHub projects")
            if g.get('ai_reasoning'):
                skill_analysis['evidence'].append(g.get('ai_reasoning'))
            proficiency_data['verified_skills'].append(canonical_skill)
            proficiency_data['github_verified_skills'].append(canonical_skill)
        else:
            # Claimed but NOT found in GitHub
            skill_analysis['proficiency'] = 0
            skill_analysis['verified'] = False
            skill_analysis['has_github_evidence'] = False
            skill_analysis['evidence'].append("⚠️ Claimed but no evidence found in GitHub repos")
            proficiency_data['unverified_skills'].append(canonical_skill)
            proficiency_data['claimed_no_evidence_skills'].append(canonical_skill)

        prof = skill_analysis['proficiency']
        skill_analysis['level'] = (
            'Expert' if prof >= 80 else
            'Advanced' if prof >= 60 else
            'Intermediate' if prof >= 40 else
            'Elementary' if prof >= 20 else
            'Beginner'
        )

        proficiency_data['skills'].append(skill_analysis)

    # ================= AUTO-DETECTED GITHUB SKILLS =================
    for skill_original in github_skills_canonical.keys():
        canonical_skill = canonicalize_skill_name(skill_original)
        skill_normalized = normalize_skill_name(canonical_skill)
        
        # Skip if already processed
        if skill_normalized in processed_skills:
            continue
        processed_skills.add(skill_normalized)
        
        g = github_skills_canonical[skill_original]

        skill_entry = {
            'name': canonical_skill,
            'proficiency': g.get('ai_proficiency', 30),
            'level': (
                'Expert' if g.get('ai_proficiency', 30) >= 80 else
                'Advanced' if g.get('ai_proficiency', 30) >= 60 else
                'Intermediate' if g.get('ai_proficiency', 30) >= 40 else
                'Elementary'
            ),
            'evidence': [
                "🔍 Auto-detected from GitHub — you didn't list this skill",
                g.get('ai_reasoning', "")
            ],
            'verified': True,
            'has_github_evidence': True
        }

        proficiency_data['skills'].append(skill_entry)
        proficiency_data['extra_detected_skills'].append(canonical_skill)

    # Sort list by proficiency descending
    proficiency_data['skills'].sort(key=lambda x: x['proficiency'], reverse=True)

    return proficiency_data


# ===================== ROADMAP GENERATION ===================== #
def generate_roadmap_with_courses(current_skills, target_role):
    """Generate roadmap with embedded course links using Gemini"""
    
    # Canonicalize skills
    canonical_skills = [canonicalize_skill_name(s) for s in current_skills]
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""
        Create a comprehensive career roadmap for transitioning to {target_role}.
        Current skills: {', '.join(canonical_skills)}
        
        Return a detailed JSON roadmap with REAL, WORKING course URLs.
        
        Format:
        {{
          "current_position": "Current level description",
          "target_position": "{target_role}",
          "paths": [
            {{
              "path_name": "Path name",
              "description": "Why this path",
              "difficulty": "Easy/Medium/Hard",
              "timeline": "6-12 months",
              "steps": [
                {{
                  "step_number": 1,
                  "title": "Master Core Skills",
                  "estimated_time": "2-3 months",
                  "skills_to_learn": ["React", "Node.js"],
                  "courses": [
                    {{
                      "name": "React Complete Guide",
                      "platform": "Udemy",
                      "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                      "level": "Beginner to Advanced"
                    }}
                  ]
                }}
              ]
            }}
          ],
          "required_skills": ["skill1", "skill2"],
          "optional_skills": ["skill3"]
        }}
        
        Include at least 3 different career paths with 3-5 steps each.
        Each step should have 2-3 real course recommendations with actual URLs.
        """
        
        response = model.generate_content(prompt)
        text = response.text
        
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        
        if json_match:
            roadmap = json.loads(json_match.group())
            roadmap = enrich_roadmap_with_courses(roadmap)
            return roadmap
        else:
            return create_fallback_roadmap_with_courses(canonical_skills, target_role)
            
    except Exception as e:
        print(f"⚠️ Roadmap generation error: {str(e)}")
        return create_fallback_roadmap_with_courses(canonical_skills, target_role)


def create_fallback_roadmap_with_courses(current_skills, target_role):
    """Fallback roadmap with real course links"""
    
    return {
        "current_position": f"Developer with skills in {', '.join(current_skills[:3])}",
        "target_position": target_role,
        "paths": [
            {
                "path_name": "Frontend Specialist Path",
                "description": "Focus on modern frontend technologies",
                "difficulty": "Medium",
                "timeline": "6-9 months",
                "steps": [
                    {
                        "step_number": 1,
                        "title": "Master React & Modern JavaScript",
                        "estimated_time": "2-3 months",
                        "skills_to_learn": ["React", "ES6+", "TypeScript"],
                        "courses": [
                            {
                                "name": "React - The Complete Guide",
                                "platform": "Udemy",
                                "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                                "level": "All Levels"
                            },
                            {
                                "name": "JavaScript Algorithms and Data Structures",
                                "platform": "freeCodeCamp",
                                "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
                                "level": "Beginner to Intermediate"
                            }
                        ]
                    },
                    {
                        "step_number": 2,
                        "title": "Build Production Applications",
                        "estimated_time": "2-3 months",
                        "skills_to_learn": ["State Management", "API Integration", "Testing"],
                        "courses": [
                            {
                                "name": "Advanced React Patterns",
                                "platform": "Frontend Masters",
                                "url": "https://frontendmasters.com/courses/advanced-react-patterns/",
                                "level": "Advanced"
                            }
                        ]
                    }
                ]
            },
            {
                "path_name": "Full Stack Development Path",
                "description": "Become proficient in both frontend and backend",
                "difficulty": "Hard",
                "timeline": "9-12 months",
                "steps": [
                    {
                        "step_number": 1,
                        "title": "Master Backend Technologies",
                        "estimated_time": "3-4 months",
                        "skills_to_learn": ["Node.js", "Express", "Databases"],
                        "courses": [
                            {
                                "name": "Node.js - The Complete Guide",
                                "platform": "Udemy",
                                "url": "https://www.udemy.com/course/nodejs-the-complete-guide/",
                                "level": "Beginner to Advanced"
                            },
                            {
                                "name": "Full Stack Open",
                                "platform": "University of Helsinki",
                                "url": "https://fullstackopen.com/en/",
                                "level": "All Levels"
                            }
                        ]
                    }
                ]
            }
        ],
        "required_skills": ["JavaScript", "React", "HTML", "CSS", "Git"],
        "optional_skills": ["TypeScript", "GraphQL", "Docker", "AWS"]
    }


def enrich_roadmap_with_courses(roadmap):
    """Add course links to roadmap steps that don't have them"""
    
    course_database = {
        "react": {
            "name": "React Complete Course",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
            "level": "All Levels"
        },
        "javascript": {
            "name": "JavaScript - The Complete Guide",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/",
            "level": "All Levels"
        },
        "python": {
            "name": "Complete Python Bootcamp",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/complete-python-bootcamp/",
            "level": "Beginner to Advanced"
        },
        "node": {
            "name": "Node.js Complete Guide",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/nodejs-the-complete-guide/",
            "level": "All Levels"
        },
        "html": {
            "name": "HTML & CSS for Beginners",
            "platform": "freeCodeCamp",
            "url": "https://www.freecodecamp.org/learn/responsive-web-design/",
            "level": "Beginner"
        },
        "css": {
            "name": "Advanced CSS and Sass",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/advanced-css-and-sass/",
            "level": "Intermediate"
        }
    }
    
    if 'paths' in roadmap:
        for path in roadmap['paths']:
            if 'steps' in path:
                for step in path['steps']:
                    if 'courses' not in step or not step['courses']:
                        step['courses'] = []
                        
                        if 'skills_to_learn' in step:
                            for skill in step['skills_to_learn'][:2]:
                                skill_lower = skill.lower()
                                for key, course in course_database.items():
                                    if key in skill_lower:
                                        step['courses'].append(course)
                                        break
                        
                        if not step['courses']:
                            step['courses'].append({
                                "name": f"Learn {step.get('title', 'Skills')}",
                                "platform": "Coursera",
                                "url": "https://www.coursera.org/",
                                "level": "All Levels"
                            })
    
    return roadmap


# ===================== JOB OPPORTUNITIES ===================== #
def find_job_opportunities(skills, target_role):
    """Find real job opportunities with working links"""
    
    # Canonicalize skills
    canonical_skills = [canonicalize_skill_name(s) for s in skills]
    
    job_platforms = [
        {
            'platform': 'LinkedIn',
            'base_url': 'https://www.linkedin.com/jobs/search/',
            'params': '?keywords='
        },
        {
            'platform': 'Indeed',
            'base_url': 'https://www.indeed.com/jobs',
            'params': '?q='
        },
        {
            'platform': 'Glassdoor',
            'base_url': 'https://www.glassdoor.com/Job/jobs.htm',
            'params': '?sc.keyword='
        },
        {
            'platform': 'AngelList',
            'base_url': 'https://angel.co/jobs',
            'params': '?q='
        },
        {
            'platform': 'Stack Overflow Jobs',
            'base_url': 'https://stackoverflow.com/jobs',
            'params': '?q='
        }
    ]
    
    jobs = []
    
    for platform_info in job_platforms:
        role_url = platform_info['base_url'] + platform_info['params'] + target_role.replace(' ', '%20')
        jobs.append({
            'title': f'{target_role} Positions',
            'company': f'Various Companies on {platform_info["platform"]}',
            'location': 'Multiple Locations',
            'skills_matched': canonical_skills[:5],
            'url': role_url,
            'platform': platform_info['platform']
        })
        
        if len(canonical_skills) >= 2:
            skills_query = '+'.join(canonical_skills[:2]).replace(' ', '+')
            skills_url = platform_info['base_url'] + platform_info['params'] + skills_query
            jobs.append({
                'title': f'{canonical_skills[0]} Developer',
                'company': f'Multiple Employers on {platform_info["platform"]}',
                'location': 'Remote & On-site',
                'skills_matched': canonical_skills[:6],
                'url': skills_url,
                'platform': platform_info['platform']
            })
    
    return jobs[:10]


# ===================== INDUSTRY TRENDS ===================== #
def get_industry_trends(target_role):
    """Get industry trends using Gemini AI"""
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        What are the top 10 most in-demand, trending skills for {target_role} in 2024-2025?
        
        Return as JSON array:
        [
          {{
            "skill": "Skill name (use proper capitalization like JavaScript, HTML, React)",
            "trend": "hot/rising/stable",
            "description": "Why this skill matters (one sentence)"
          }}
        ]
        
        Focus on practical, current technologies and frameworks.
        Use proper capitalization for skill names.
        """
        
        response = model.generate_content(prompt)
        text = response.text
        
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        
        if json_match:
            trends = json.loads(json_match.group())
            # Canonicalize trend skill names
            for trend in trends:
                trend['skill'] = canonicalize_skill_name(trend.get('skill', ''))
            return trends
        else:
            return get_fallback_trends(target_role)
            
    except Exception as e:
        print(f"⚠️ Trends error: {str(e)}")
        return get_fallback_trends(target_role)


def get_fallback_trends(target_role):
    """Fallback trends"""
    return [
        {"skill": "Artificial Intelligence", "trend": "hot", "description": "AI integration is becoming essential across all tech roles"},
        {"skill": "Cloud Computing", "trend": "hot", "description": "Cloud platforms like AWS, Azure are industry standard"},
        {"skill": "TypeScript", "trend": "rising", "description": "Type-safe JavaScript for large-scale applications"},
        {"skill": "React", "trend": "stable", "description": "Most popular frontend framework for modern web apps"},
        {"skill": "Docker", "trend": "rising", "description": "Container orchestration for scalable deployments"},
        {"skill": "Python", "trend": "stable", "description": "Versatile language for web dev, data science, and AI"},
        {"skill": "GraphQL", "trend": "rising", "description": "Modern API query language gaining adoption"},
        {"skill": "Next.js", "trend": "hot", "description": "Full-stack React framework with server-side rendering"},
        {"skill": "Cyber Security", "trend": "hot", "description": "Security skills are critical as threats increase"},
        {"skill": "System Design", "trend": "stable", "description": "Architectural skills for scalable systems"}
    ]