import os
import json
import tempfile
import platform
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from dotenv import load_dotenv

load_dotenv()

from ai_utils import (
    analyze_github_with_ai,
    generate_skill_proficiency_with_ai,
    generate_roadmap_with_courses,
    find_job_opportunities,
    get_industry_trends,
    normalize_skill_name,
    canonicalize_skill_name
)

from utils import generate_resume_pdf, generate_portfolio_html, get_temp_directory

app = FastAPI(title="AI Portfolio Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def process_skills_input(skills_input):
    """
    Process skills input and return canonicalized unique skills list.
    Handles case-insensitivity: 'html', 'HTML', 'Html' all become 'HTML'
    """
    if isinstance(skills_input, list):
        raw_skills = [s.strip() for s in skills_input if s and s.strip()]
    elif isinstance(skills_input, str):
        raw_skills = [s.strip() for s in skills_input.split(",") if s and s.strip()]
    else:
        return []
    
    # Canonicalize and deduplicate (case-insensitive)
    seen_normalized = set()
    canonical_skills = []
    
    for skill in raw_skills:
        canonical = canonicalize_skill_name(skill)
        normalized = normalize_skill_name(canonical)
        
        if normalized not in seen_normalized:
            seen_normalized.add(normalized)
            canonical_skills.append(canonical)
    
    return canonical_skills


@app.post("/api/generate-portfolio")
async def generate_portfolio(request: Request):
    """Main endpoint to generate complete portfolio analysis"""
    
    try:
        body = await request.json()
        
        name = body.get('name', '')
        email = body.get('email', '')
        phone = body.get('phone', '')
        department = body.get('department', '')
        skills = body.get('skills', '')
        github_link = body.get('github_link', '')
        target_role = body.get('target_role', '')
        projects = body.get('projects', [])
        intro_video_url = body.get('intro_video_url', '')
        
        # Parse and canonicalize skills (handles case sensitivity)
        user_skills = process_skills_input(skills)
        
        user_projects = projects if isinstance(projects, list) else json.loads(projects) if projects else []
        
        print(f"✅ Analyzing portfolio for {name}...")
        print(f"📋 User skills (canonicalized): {user_skills}")
        
        # Step 1: Analyze GitHub profile with AI
        github_skills = {}
        github_projects = []
        
        if github_link:
            try:
                print("🔍 Analyzing GitHub profile with AI...")
                github_skills, github_projects = analyze_github_with_ai(github_link)
                print(f"✅ AI analysis complete: Found {len(github_skills)} skills")
                print(f"📊 Skills detected: {list(github_skills.keys())}")
            except Exception as e:
                print(f"⚠️ GitHub analysis error: {str(e)}")
        else:
            print("⚠️ No GitHub link provided")
        
        # Step 2: Generate skill proficiency analysis with AI (CASE INSENSITIVE)
        print("📊 Calculating skill proficiency with AI...")
        proficiency_analysis = generate_skill_proficiency_with_ai(
            user_skills, 
            github_skills, 
            user_projects, 
            github_projects
        )
        print(f"✅ Analyzed {len(proficiency_analysis.get('skills', []))} skills")
        print(f"✅ GitHub verified skills: {proficiency_analysis.get('github_verified_skills', [])}")
        print(f"⚠️ Claimed but no evidence: {proficiency_analysis.get('claimed_no_evidence_skills', [])}")
        
        # Step 3: Generate career roadmap
        print("🗺️ Generating career roadmap with AI...")
        
        # Merge skills case-insensitively for roadmap
        all_skills_normalized = {}
        for s in user_skills:
            all_skills_normalized[normalize_skill_name(s)] = s
        for s in github_skills.keys():
            normalized = normalize_skill_name(s)
            if normalized not in all_skills_normalized:
                all_skills_normalized[normalized] = canonicalize_skill_name(s)
        
        all_skills = list(all_skills_normalized.values())
        
        roadmap = generate_roadmap_with_courses(all_skills, target_role)
        print(f"✅ Generated {len(roadmap.get('paths', []))} career paths")
        
        # Step 4: Find job opportunities
        print("💼 Searching job opportunities...")
        jobs = find_job_opportunities(all_skills, target_role)
        print(f"✅ Found {len(jobs)} job opportunities")
        
        # Step 5: Get industry trends with AI
        print("📈 Analyzing industry trends with AI...")
        trends = get_industry_trends(target_role)
        
        # Get GitHub verified skills (normalized for comparison)
        github_verified_normalized = set(
            normalize_skill_name(s) for s in proficiency_analysis.get('github_verified_skills', [])
        )
        
        # Get claimed but no evidence skills (normalized)
        claimed_no_evidence_normalized = set(
            normalize_skill_name(s) for s in proficiency_analysis.get('claimed_no_evidence_skills', [])
        )
        
        # All GitHub skills normalized
        github_skills_normalized = set(normalize_skill_name(s) for s in github_skills.keys())
        
        # User skills normalized
        user_skills_normalized = set(normalize_skill_name(s) for s in user_skills)
        
        # Mark trends with proper status
        for trend in trends:
            trend_normalized = normalize_skill_name(trend['skill'])
            
            # Check if skill matches any GitHub skill (case-insensitive)
            is_in_github = any(
                trend_normalized == gh_norm or trend_normalized in gh_norm or gh_norm in trend_normalized
                for gh_norm in github_skills_normalized
            )
            
            # Check if claimed by user
            is_claimed = any(
                trend_normalized == us_norm or trend_normalized in us_norm or us_norm in trend_normalized
                for us_norm in user_skills_normalized
            )
            
            # Check verification status
            is_verified_in_github = any(
                trend_normalized == v or trend_normalized in v or v in trend_normalized
                for v in github_verified_normalized
            )
            
            is_claimed_no_evidence = any(
                trend_normalized == c or trend_normalized in c or c in trend_normalized
                for c in claimed_no_evidence_normalized
            )
            
            # Set status based on evidence
            if is_verified_in_github or is_in_github:
                trend['has_skill'] = True
                trend['skill_status'] = 'verified'
                trend['status_message'] = '✅ You already have this skill (verified in GitHub)'
            elif is_claimed_no_evidence or (is_claimed and not is_in_github):
                trend['has_skill'] = True
                trend['skill_status'] = 'claimed_no_evidence'
                trend['status_message'] = '⚠️ Claimed but no evidence found in GitHub'
            else:
                trend['has_skill'] = False
                trend['skill_status'] = 'not_learned'
                trend['status_message'] = '📚 Consider learning this skill'
        
        print(f"✅ Identified {len(trends)} trending skills")
        
        # Prepare response data
        response_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'department': department,
            'target_role': target_role,
            'skills': all_skills,
            'github_link': github_link,
            'intro_video_url': intro_video_url,
            'projects': user_projects,
            'github_projects': github_projects,
            'proficiency_analysis': proficiency_analysis,
            'roadmap': roadmap,
            'job_opportunities': jobs,
            'industry_trends': trends
        }
        
        print("🎉 Portfolio generation complete!")
        return JSONResponse(response_data)
        
    except Exception as e:
        print(f"❌ Error generating portfolio: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"error": "Failed to generate portfolio", "message": str(e)},
            status_code=500
        )


@app.post("/api/generate-resume")
async def download_resume(request: Request):
    """Generate and download PDF resume"""
    
    try:
        data = await request.json()
        print(f"📄 Generating resume for {data.get('name', 'user')}...")
        
        # Canonicalize skills in the data
        if 'skills' in data:
            data['skills'] = process_skills_input(data['skills'])
        
        pdf_path = generate_resume_pdf(data)
        print(f"✅ Resume generated at: {pdf_path}")
        
        # Verify file exists
        if not os.path.exists(pdf_path):
            raise Exception(f"PDF file was not created at {pdf_path}")
        
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=f"{data.get('name', 'user').replace(' ', '_')}_resume.pdf",
            headers={
                "Content-Disposition": f"attachment; filename={data.get('name', 'user').replace(' ', '_')}_resume.pdf"
            }
        )
    except Exception as e:
        print(f"❌ Resume generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"error": "Failed to generate resume", "message": str(e)},
            status_code=500
        )


@app.post("/api/generate-portfolio-html")
async def generate_html(request: Request):
    """Generate HTML portfolio for download"""
    
    try:
        data = await request.json()
        
        # Canonicalize skills in the data
        if 'skills' in data:
            data['skills'] = process_skills_input(data['skills'])
        
        html_content = generate_portfolio_html(data)
        return JSONResponse({"html": html_content})
    except Exception as e:
        print(f"❌ HTML generation error: {str(e)}")
        return JSONResponse(
            {"error": "Failed to generate HTML", "message": str(e)},
            status_code=500
        )


@app.post("/api/download-portfolio")
async def download_portfolio(request: Request):
    """Download portfolio as HTML file"""
    
    try:
        data = await request.json()
        
        # Canonicalize skills in the data
        if 'skills' in data:
            data['skills'] = process_skills_input(data['skills'])
        
        html_content = generate_portfolio_html(data)
        
        # Use OS-appropriate temp directory
        temp_dir = get_temp_directory()
        
        # Clean filename
        safe_name = "".join(c for c in data.get('name', 'portfolio') if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_name = safe_name.replace(' ', '_') if safe_name else 'portfolio'
        
        filename = f"{safe_name}_portfolio.html"
        filepath = os.path.join(temp_dir, filename)
        
        print(f"📁 Saving portfolio to: {filepath}")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Verify file exists
        if not os.path.exists(filepath):
            raise Exception(f"Portfolio file was not created at {filepath}")
        
        print(f"✅ Portfolio saved successfully: {filepath}")
        
        return FileResponse(
            filepath,
            media_type='text/html',
            filename=filename,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        print(f"❌ Portfolio download error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"error": "Failed to download portfolio", "message": str(e)},
            status_code=500
        )


@app.get("/")
async def root():
    return {"message": "AI Portfolio Analyzer API", "status": "running", "version": "2.3"}


@app.get("/health")
async def health():
    return {"status": "healthy", "ai_enabled": True}


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Portfolio Analyzer API...")
    print("🤖 Gemini AI integration enabled")
    print("🔗 Skill Dependency Graph active (Difficulty-Based)")
    print("🔠 Case-insensitive skill matching enabled")
    print(f"📁 Temp directory: {get_temp_directory()}")
    uvicorn.run(app, host="0.0.0.0", port=5000)