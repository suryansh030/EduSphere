from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
import os
import tempfile
import platform


def get_temp_directory():
    """Get OS-appropriate temporary directory"""
    if platform.system() == 'Windows':
        # Use Windows temp directory
        temp_dir = tempfile.gettempdir()
    else:
        # Use /tmp for Unix-like systems
        temp_dir = '/tmp'
    
    # Ensure directory exists
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir, exist_ok=True)
    
    return temp_dir


def generate_resume_pdf(data):
    """Generate a professional resume PDF"""
    
    # Use cross-platform temp directory
    temp_dir = get_temp_directory()
    
    filename = f"resume_{data.get('name', 'user').replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
    filepath = os.path.join(temp_dir, filename)
    
    print(f"📁 Creating PDF at: {filepath}")
    
    doc = SimpleDocTemplate(filepath, pagesize=letter,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        borderWidth=1,
        borderColor=colors.HexColor('#3b82f6'),
        borderPadding=5,
        backColor=colors.HexColor('#eff6ff')
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY
    )
    
    # Header
    story.append(Paragraph(data.get('name', 'N/A').upper(), title_style))
    
    contact_info = f"{data.get('email', '')} | {data.get('phone', '')} | {data.get('department', '')}"
    story.append(Paragraph(contact_info, styles['Normal']))
    
    if data.get('github_link'):
        story.append(Paragraph(f"GitHub: {data.get('github_link')}", styles['Normal']))
    
    story.append(Spacer(1, 20))
    
    # Objective
    story.append(Paragraph("CAREER OBJECTIVE", heading_style))
    
    # Get top verified skills for objective
    proficiency = data.get('proficiency_analysis', {})
    verified_skills = proficiency.get('github_verified_skills', [])[:3]
    skill_text = ', '.join(verified_skills) if verified_skills else ', '.join(data.get('skills', [])[:3])
    
    objective = f"Aspiring {data.get('target_role', 'Professional')} with strong foundation in {skill_text}. Seeking to leverage my technical skills and passion for innovation to contribute to a dynamic organization."
    story.append(Paragraph(objective, body_style))
    story.append(Spacer(1, 12))
    
    # Skills Section - Enhanced with verification status
    story.append(Paragraph("TECHNICAL SKILLS", heading_style))
    
    if proficiency and 'skills' in proficiency:
        # Separate verified and unverified skills
        verified_expert = []
        verified_advanced = []
        verified_intermediate = []
        unverified_skills = []
        
        for s in proficiency['skills']:
            skill_name = s['name']
            prof_level = s.get('proficiency', 0)
            has_evidence = s.get('has_github_evidence', s.get('verified', False))
            
            if has_evidence:
                if prof_level >= 80:
                    verified_expert.append(skill_name)
                elif prof_level >= 60:
                    verified_advanced.append(skill_name)
                elif prof_level >= 40:
                    verified_intermediate.append(skill_name)
            else:
                unverified_skills.append(skill_name)
        
        if verified_expert:
            story.append(Paragraph(f"<b>Expert (Verified):</b> {', '.join(verified_expert)}", body_style))
        if verified_advanced:
            story.append(Paragraph(f"<b>Advanced (Verified):</b> {', '.join(verified_advanced)}", body_style))
        if verified_intermediate:
            story.append(Paragraph(f"<b>Intermediate (Verified):</b> {', '.join(verified_intermediate)}", body_style))
        if unverified_skills:
            story.append(Paragraph(f"<b>Additional Skills (Self-reported):</b> {', '.join(unverified_skills)}", body_style))
    else:
        story.append(Paragraph(', '.join(data.get('skills', [])), body_style))
    
    story.append(Spacer(1, 12))
    
    # Projects
    story.append(Paragraph("PROJECTS", heading_style))
    projects = data.get('projects', [])
    github_projects = data.get('github_projects', [])
    
    all_projects = projects + github_projects
    
    for idx, project in enumerate(all_projects[:5], 1):
        project_title = f"<b>{idx}. {project.get('title', project.get('name', 'Project'))}</b>"
        story.append(Paragraph(project_title, body_style))
        
        description = project.get('description', 'No description available')
        if description and len(description) > 200:
            description = description[:200] + "..."
        story.append(Paragraph(description or "No description available", body_style))
        
        # Show technologies used
        languages = project.get('languages', [])
        if languages:
            story.append(Paragraph(f"<i>Technologies: {', '.join(languages[:5])}</i>", body_style))
        
        if project.get('url'):
            story.append(Paragraph(f"<i>Link: {project['url']}</i>", body_style))
        
        story.append(Spacer(1, 8))
    
    # Education
    story.append(Paragraph("EDUCATION", heading_style))
    education = f"{data.get('department', 'Computer Science')}<br/>Currently pursuing degree"
    story.append(Paragraph(education, body_style))
    story.append(Spacer(1, 12))
    
    # Key Achievements
    story.append(Paragraph("KEY ACHIEVEMENTS", heading_style))
    
    # Calculate verified vs total skills
    total_skills = len(proficiency.get('skills', []))
    verified_count = len(proficiency.get('github_verified_skills', []))
    
    achievements = [
        f"Developed {len(all_projects)} projects showcasing practical application of technical skills",
        f"Proficient in {total_skills} technologies with {verified_count} skills verified through GitHub projects",
    ]
    
    if data.get('github_link'):
        achievements.append("Active GitHub contributor with multiple repositories demonstrating real-world coding experience")
    
    # Add trending skills the user has
    trends = data.get('industry_trends', [])
    trending_skills_owned = [t['skill'] for t in trends if t.get('skill_status') == 'verified']
    if trending_skills_owned:
        achievements.append(f"Proficient in trending technologies: {', '.join(trending_skills_owned[:3])}")
    
    for achievement in achievements:
        story.append(Paragraph(f"• {achievement}", body_style))
    
    story.append(Spacer(1, 12))
    
    # Career Roadmap Highlights
    roadmap = data.get('roadmap', {})
    if roadmap and 'paths' in roadmap:
        story.append(Paragraph("CAREER DEVELOPMENT PLAN", heading_style))
        
        # Get required skills from roadmap
        required_skills = roadmap.get('required_skills', [])[:5]
        
        career_plan = f"Currently pursuing path towards {data.get('target_role', 'target role')} with focus on mastering advanced concepts and building real-world applications."
        story.append(Paragraph(career_plan, body_style))
        
        if required_skills:
            story.append(Paragraph(f"<b>Focus Areas:</b> {', '.join(required_skills)}", body_style))
    
    # Footer
    story.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=TA_CENTER
    )
    story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')} | AI Portfolio Analyzer", footer_style))
    
    # Build PDF
    doc.build(story)
    
    print(f"✅ PDF created successfully at: {filepath}")
    
    return filepath


def generate_portfolio_html(data):
    """Generate comprehensive HTML portfolio page with all analysis data"""
    
    name = data.get('name', 'N/A')
    department = data.get('department', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    target_role = data.get('target_role', '')
    intro_video = data.get('intro_video_url', '')
    github_link = data.get('github_link', '')
    skills = data.get('skills', [])
    projects = data.get('projects', [])
    github_projects = data.get('github_projects', [])
    proficiency = data.get('proficiency_analysis', {})
    roadmap = data.get('roadmap', {})
    jobs = data.get('job_opportunities', [])
    trends = data.get('industry_trends', [])
    
    # Generate Skills HTML with verification status
    skills_html = ""
    for skill in proficiency.get('skills', []):
        prof_value = skill.get('proficiency', 0)
        has_evidence = skill.get('has_github_evidence', skill.get('verified', False))
        
        # Determine color based on verification and level
        if has_evidence:
            if prof_value >= 80:
                border_color = "#10b981"  # Green - Expert verified
                status_icon = "✅"
                status_text = "Verified Expert"
            elif prof_value >= 60:
                border_color = "#3b82f6"  # Blue - Advanced verified
                status_icon = "✅"
                status_text = "Verified Advanced"
            elif prof_value >= 40:
                border_color = "#8b5cf6"  # Purple - Intermediate verified
                status_icon = "✅"
                status_text = "Verified Intermediate"
            else:
                border_color = "#6b7280"  # Gray - Beginner verified
                status_icon = "✅"
                status_text = "Verified Beginner"
        else:
            border_color = "#f59e0b"  # Orange - Claimed but no evidence
            status_icon = "⚠️"
            status_text = "Claimed - No GitHub Evidence"
        
        evidence_html = ""
        for ev in skill.get('evidence', []):
            evidence_html += f"<div class='evidence-item'>{ev}</div>"
        
        skills_html += f"""
        <div class="skill-card" style="border-left: 4px solid {border_color};">
            <div class="skill-header">
                <span class="skill-name">{skill.get('name', '')}</span>
                <span class="skill-status" style="color: {border_color};">{status_icon} {status_text}</span>
            </div>
            <div class="skill-level-badge">{skill.get('level', 'Beginner')}</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: {prof_value}%; background: {border_color};"></div>
                <span class="progress-text">{prof_value}%</span>
            </div>
            <div class="skill-evidence">
                {evidence_html}
            </div>
        </div>
        """
    
    # Generate Projects HTML
    all_projects = projects + github_projects
    projects_html = ""
    for project in all_projects[:8]:
        project_name = project.get('title', project.get('name', 'Project'))
        project_desc = project.get('description', 'No description available')
        if project_desc and len(project_desc) > 150:
            project_desc = project_desc[:150] + "..."
        project_url = project.get('link', project.get('url', ''))
        languages = project.get('languages', [])
        stars = project.get('stars', 0)
        
        lang_badges = ''.join([f'<span class="tech-badge">{lang}</span>' for lang in languages[:4]])
        
        projects_html += f"""
        <div class="project-card">
            <h3>{project_name}</h3>
            <p class="project-desc">{project_desc or 'No description'}</p>
            <div class="project-tech">{lang_badges if lang_badges else '<span class="tech-badge">N/A</span>'}</div>
            {f'<div class="project-stars">⭐ {stars} stars</div>' if stars else ''}
            {f'<a href="{project_url}" target="_blank" class="project-link">View Project →</a>' if project_url else ''}
        </div>
        """
    
    # Generate Roadmap HTML
    roadmap_html = ""
    for path in roadmap.get('paths', [])[:2]:
        steps_html = ""
        for step in path.get('steps', [])[:4]:
            courses_html = ""
            for course in step.get('courses', [])[:3]:
                courses_html += f"""
                <a href="{course.get('url', '#')}" target="_blank" class="course-card">
                    <span class="course-platform">{course.get('platform', 'Online')}</span>
                    <span class="course-name">{course.get('name', 'Course')}</span>
                    <span class="course-level">{course.get('level', 'All Levels')}</span>
                </a>
                """
            
            skills_to_learn = ', '.join(step.get('skills_to_learn', []))
            
            steps_html += f"""
            <div class="roadmap-step">
                <div class="step-marker">
                    <div class="step-number">{step.get('step_number', '')}</div>
                </div>
                <div class="step-content">
                    <h4>{step.get('title', '')}</h4>
                    <p class="step-time">⏱️ {step.get('estimated_time', 'N/A')}</p>
                    <p class="step-skills">📚 Learn: {skills_to_learn}</p>
                    <div class="courses-container">
                        <p class="courses-title">Recommended Courses:</p>
                        {courses_html}
                    </div>
                </div>
            </div>
            """
        
        roadmap_html += f"""
        <div class="career-path">
            <div class="path-header">
                <h3>{path.get('path_name', 'Career Path')}</h3>
                <div class="path-meta">
                    <span class="difficulty-badge difficulty-{path.get('difficulty', 'Medium').lower()}">{path.get('difficulty', 'Medium')}</span>
                    <span class="timeline-badge">📅 {path.get('timeline', 'N/A')}</span>
                </div>
            </div>
            <p class="path-description">{path.get('description', '')}</p>
            <div class="steps-container">
                {steps_html}
            </div>
        </div>
        """
    
    # Generate Industry Trends HTML with proper status
    trends_html = ""
    for trend in trends:
        skill_status = trend.get('skill_status', 'not_learned')
        status_message = trend.get('status_message', '')
        trend_type = trend.get('trend', 'stable')
        
        # Determine styling based on status
        if skill_status == 'verified':
            status_class = "trend-verified"
            border_color = "#10b981"
            bg_color = "rgba(16, 185, 129, 0.1)"
        elif skill_status == 'claimed_no_evidence':
            status_class = "trend-claimed"
            border_color = "#f59e0b"
            bg_color = "rgba(245, 158, 11, 0.1)"
        else:
            status_class = "trend-learn"
            border_color = "#6366f1"
            bg_color = "rgba(99, 102, 241, 0.1)"
        
        # Trend indicator
        if trend_type == 'hot':
            trend_icon = "🔥"
            trend_label = "Hot"
        elif trend_type == 'rising':
            trend_icon = "📈"
            trend_label = "Rising"
        else:
            trend_icon = "📊"
            trend_label = "Stable"
        
        trends_html += f"""
        <div class="trend-card {status_class}" style="border-left: 4px solid {border_color}; background: {bg_color};">
            <div class="trend-header">
                <span class="trend-icon">{trend_icon}</span>
                <span class="trend-name">{trend.get('skill', '')}</span>
                <span class="trend-label">{trend_label}</span>
            </div>
            <p class="trend-description">{trend.get('description', '')}</p>
            <div class="trend-status-message" style="color: {border_color};">
                {status_message}
            </div>
        </div>
        """
    
    # Generate Jobs HTML
    jobs_html = ""
    for job in jobs[:8]:
        jobs_html += f"""
        <a href="{job.get('url', '#')}" target="_blank" class="job-card">
            <div class="job-header">
                <h4>{job.get('title', 'Job Title')}</h4>
                <span class="platform-badge">{job.get('platform', '')}</span>
            </div>
            <p class="job-company">{job.get('company', '')}</p>
            <p class="job-location">📍 {job.get('location', 'Multiple Locations')}</p>
            <div class="job-skills">
                {''.join([f'<span class="skill-match">{s}</span>' for s in job.get('skills_matched', [])[:4]])}
            </div>
        </a>
        """
    
    # Summary stats
    total_skills = len(proficiency.get('skills', []))
    verified_skills = len(proficiency.get('github_verified_skills', []))
    unverified_skills = len(proficiency.get('claimed_no_evidence_skills', []))
    extra_skills = len(proficiency.get('extra_detected_skills', []))
    
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{name} - AI Portfolio Analysis</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
                color: #e0e0e0;
                line-height: 1.6;
                min-height: 100vh;
            }}
            
            .container {{
                max-width: 1400px;
                margin: 0 auto;
                padding: 40px 20px;
            }}
            
            /* Header Section */
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 50px 40px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
                text-align: center;
                margin-bottom: 40px;
                position: relative;
                overflow: hidden;
            }}
            
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
                opacity: 0.5;
            }}
            
            .header h1 {{
                color: white;
                font-size: 3em;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                position: relative;
            }}
            
            .header .subtitle {{
                color: rgba(255,255,255,0.9);
                font-size: 1.3em;
                margin-bottom: 15px;
                position: relative;
            }}
            
            .header .contact-info {{
                color: rgba(255,255,255,0.85);
                font-size: 1.1em;
                position: relative;
            }}
            
            .header .contact-info a {{
                color: white;
                text-decoration: none;
            }}
            
            .target-role-badge {{
                display: inline-block;
                background: rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                padding: 12px 30px;
                border-radius: 30px;
                margin-top: 20px;
                font-size: 1.2em;
                font-weight: bold;
                color: white;
                position: relative;
            }}
            
            /* Stats Summary */
            .stats-summary {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }}
            
            .stat-card {{
                background: rgba(255,255,255,0.05);
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.1);
                transition: transform 0.3s, box-shadow 0.3s;
            }}
            
            .stat-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
            }}
            
            .stat-number {{
                font-size: 2.5em;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }}
            
            .stat-label {{
                color: #a0a0a0;
                font-size: 0.95em;
                margin-top: 5px;
            }}
            
            /* Section Styles */
            .section {{
                background: rgba(255,255,255,0.03);
                border-radius: 20px;
                padding: 35px;
                margin-bottom: 35px;
                border: 1px solid rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
            }}
            
            .section h2 {{
                color: #667eea;
                font-size: 1.8em;
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(102, 126, 234, 0.3);
            }}
            
            /* Skills Section */
            .skills-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 20px;
            }}
            
            .skill-card {{
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
            }}
            
            .skill-card:hover {{
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            }}
            
            .skill-header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }}
            
            .skill-name {{
                font-size: 1.15em;
                font-weight: 600;
                color: #fff;
            }}
            
            .skill-status {{
                font-size: 0.85em;
                font-weight: 500;
            }}
            
            .skill-level-badge {{
                display: inline-block;
                background: rgba(102, 126, 234, 0.2);
                color: #667eea;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.8em;
                margin-bottom: 12px;
            }}
            
            .progress-container {{
                position: relative;
                height: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 10px;
            }}
            
            .progress-bar {{
                height: 100%;
                border-radius: 5px;
                transition: width 0.5s ease;
            }}
            
            .progress-text {{
                position: absolute;
                right: 0;
                top: -20px;
                font-size: 0.85em;
                color: #a0a0a0;
            }}
            
            .skill-evidence {{
                font-size: 0.85em;
                color: #888;
                margin-top: 10px;
            }}
            
            .evidence-item {{
                padding: 3px 0;
            }}
            
            /* Projects Section */
            .projects-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }}
            
            .project-card {{
                background: rgba(255,255,255,0.05);
                border-radius: 15px;
                padding: 25px;
                border: 1px solid rgba(255,255,255,0.08);
                transition: transform 0.3s, box-shadow 0.3s;
            }}
            
            .project-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
            }}
            
            .project-card h3 {{
                color: #667eea;
                margin-bottom: 12px;
                font-size: 1.2em;
            }}
            
            .project-desc {{
                color: #b0b0b0;
                font-size: 0.95em;
                margin-bottom: 15px;
            }}
            
            .project-tech {{
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 12px;
            }}
            
            .tech-badge {{
                background: rgba(102, 126, 234, 0.2);
                color: #667eea;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.8em;
            }}
            
            .project-stars {{
                color: #fbbf24;
                font-size: 0.9em;
                margin-bottom: 10px;
            }}
            
            .project-link {{
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }}
            
            .project-link:hover {{
                color: #818cf8;
            }}
            
            /* Roadmap Section */
            .career-path {{
                background: rgba(255,255,255,0.03);
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 25px;
                border: 1px solid rgba(255,255,255,0.08);
            }}
            
            .path-header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 15px;
            }}
            
            .path-header h3 {{
                color: #667eea;
                font-size: 1.4em;
            }}
            
            .path-meta {{
                display: flex;
                gap: 10px;
            }}
            
            .difficulty-badge {{
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 0.85em;
                font-weight: 500;
            }}
            
            .difficulty-easy {{
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
            }}
            
            .difficulty-medium {{
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
            }}
            
            .difficulty-hard {{
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }}
            
            .timeline-badge {{
                background: rgba(102, 126, 234, 0.2);
                color: #667eea;
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 0.85em;
            }}
            
            .path-description {{
                color: #b0b0b0;
                margin-bottom: 25px;
            }}
            
            .steps-container {{
                position: relative;
            }}
            
            .roadmap-step {{
                display: flex;
                gap: 25px;
                margin-bottom: 25px;
                position: relative;
            }}
            
            .step-marker {{
                position: relative;
            }}
            
            .step-marker::after {{
                content: '';
                position: absolute;
                left: 50%;
                top: 60px;
                width: 2px;
                height: calc(100% + 25px);
                background: linear-gradient(to bottom, #667eea, transparent);
                transform: translateX(-50%);
            }}
            
            .roadmap-step:last-child .step-marker::after {{
                display: none;
            }}
            
            .step-number {{
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2em;
                color: white;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            }}
            
            .step-content {{
                flex: 1;
                background: rgba(255,255,255,0.03);
                border-radius: 12px;
                padding: 20px;
            }}
            
            .step-content h4 {{
                color: #fff;
                margin-bottom: 8px;
                font-size: 1.1em;
            }}
            
            .step-time {{
                color: #a0a0a0;
                font-size: 0.9em;
                margin-bottom: 8px;
            }}
            
            .step-skills {{
                color: #b0b0b0;
                font-size: 0.9em;
                margin-bottom: 15px;
            }}
            
            .courses-title {{
                color: #888;
                font-size: 0.85em;
                margin-bottom: 10px;
            }}
            
            .courses-container {{
                margin-top: 10px;
            }}
            
            .course-card {{
                display: flex;
                flex-direction: column;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 10px;
                padding: 12px 15px;
                margin-bottom: 8px;
                text-decoration: none;
                border: 1px solid rgba(102, 126, 234, 0.2);
                transition: background 0.2s;
            }}
            
            .course-card:hover {{
                background: rgba(102, 126, 234, 0.2);
            }}
            
            .course-platform {{
                color: #667eea;
                font-size: 0.75em;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            
            .course-name {{
                color: #fff;
                font-weight: 500;
                font-size: 0.95em;
            }}
            
            .course-level {{
                color: #888;
                font-size: 0.8em;
            }}
            
            /* Industry Trends Section */
            .trends-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }}
            
            .trend-card {{
                border-radius: 12px;
                padding: 20px;
                transition: transform 0.2s;
            }}
            
            .trend-card:hover {{
                transform: translateY(-3px);
            }}
            
            .trend-header {{
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
            }}
            
            .trend-icon {{
                font-size: 1.5em;
            }}
            
            .trend-name {{
                font-weight: 600;
                font-size: 1.1em;
                color: #fff;
                flex: 1;
            }}
            
            .trend-label {{
                background: rgba(255,255,255,0.1);
                padding: 3px 10px;
                border-radius: 10px;
                font-size: 0.75em;
                text-transform: uppercase;
            }}
            
            .trend-description {{
                color: #a0a0a0;
                font-size: 0.9em;
                margin-bottom: 12px;
            }}
            
            .trend-status-message {{
                font-weight: 500;
                font-size: 0.9em;
                padding: 8px 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }}
            
            /* Jobs Section */
            .jobs-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }}
            
            .job-card {{
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 20px;
                text-decoration: none;
                border: 1px solid rgba(255,255,255,0.08);
                transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
                display: block;
            }}
            
            .job-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
                border-color: rgba(102, 126, 234, 0.3);
            }}
            
            .job-header {{
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }}
            
            .job-header h4 {{
                color: #667eea;
                font-size: 1.1em;
                flex: 1;
            }}
            
            .platform-badge {{
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 4px 10px;
                border-radius: 10px;
                font-size: 0.75em;
                font-weight: 500;
            }}
            
            .job-company {{
                color: #e0e0e0;
                margin-bottom: 5px;
            }}
            
            .job-location {{
                color: #a0a0a0;
                font-size: 0.9em;
                margin-bottom: 12px;
            }}
            
            .job-skills {{
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }}
            
            .skill-match {{
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                padding: 3px 8px;
                border-radius: 8px;
                font-size: 0.75em;
            }}
            
            /* Video Section */
            .video-container {{
                position: relative;
                padding-bottom: 56.25%;
                height: 0;
                overflow: hidden;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }}
            
            .video-container iframe {{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }}
            
            /* Footer */
            .footer {{
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-size: 0.9em;
                border-top: 1px solid rgba(255,255,255,0.05);
                margin-top: 40px;
            }}
            
            .footer a {{
                color: #667eea;
                text-decoration: none;
            }}
            
            /* Responsive */
            @media (max-width: 768px) {{
                .header h1 {{
                    font-size: 2em;
                }}
                
                .section {{
                    padding: 20px;
                }}
                
                .path-header {{
                    flex-direction: column;
                    align-items: flex-start;
                }}
                
                .roadmap-step {{
                    flex-direction: column;
                }}
                
                .step-marker::after {{
                    display: none;
                }}
            }}
            
            /* Print Styles */
            @media print {{
                body {{
                    background: white;
                    color: #333;
                }}
                
                .header {{
                    background: #667eea;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }}
                
                .section {{
                    break-inside: avoid;
                    page-break-inside: avoid;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>{name}</h1>
                <p class="subtitle">{department}</p>
                <p class="contact-info">
                    {email}{f' | {phone}' if phone else ''}
                    {f' | <a href="{github_link}" target="_blank">GitHub</a>' if github_link else ''}
                </p>
                {f'<div class="target-role-badge">🎯 Aspiring {target_role}</div>' if target_role else ''}
            </div>
            
            <!-- Stats Summary -->
            <div class="stats-summary">
                <div class="stat-card">
                    <div class="stat-number">{total_skills}</div>
                    <div class="stat-label">Total Skills</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{verified_skills}</div>
                    <div class="stat-label">GitHub Verified</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{unverified_skills}</div>
                    <div class="stat-label">Claimed (No Evidence)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{extra_skills}</div>
                    <div class="stat-label">Auto-Detected</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{len(all_projects)}</div>
                    <div class="stat-label">Projects</div>
                </div>
            </div>
            
            <!-- Skills Section -->
            <div class="section">
                <h2>💡 Skills & Proficiency Analysis</h2>
                <div class="skills-grid">
                    {skills_html if skills_html else '<p>No skills data available</p>'}
                </div>
            </div>
            
            <!-- Projects Section -->
            <div class="section">
                <h2>🚀 Projects Portfolio</h2>
                <div class="projects-grid">
                    {projects_html if projects_html else '<p>No projects found</p>'}
                </div>
            </div>
            
            <!-- Career Roadmap -->
            <div class="section">
                <h2>🗺️ Career Roadmap</h2>
                {roadmap_html if roadmap_html else '<p>No roadmap generated yet</p>'}
            </div>
            
            <!-- Industry Trends -->
            <div class="section">
                <h2>📈 Industry Trends Analysis</h2>
                <div class="trends-grid">
                    {trends_html if trends_html else '<p>No trends data available</p>'}
                </div>
            </div>
            
            <!-- Job Opportunities -->
            <div class="section">
                <h2>💼 Job Opportunities</h2>
                <div class="jobs-grid">
                    {jobs_html if jobs_html else '<p>No job opportunities found</p>'}
                </div>
            </div>
            
            <!-- Intro Video -->
            {f'''
            <div class="section">
                <h2>🎬 Introduction Video</h2>
                <div class="video-container">
                    <iframe src="{intro_video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}" 
                            allowfullscreen></iframe>
                </div>
            </div>
            ''' if intro_video else ''}
            
            <!-- Footer -->
            <div class="footer">
                <p>Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p>Powered by <strong>AI Portfolio Analyzer</strong></p>
            </div>
        </div>
        
        <script>
            // Add smooth scrolling and animations
            document.addEventListener('DOMContentLoaded', function() {{
                // Animate progress bars on scroll
                const observer = new IntersectionObserver((entries) => {{
                    entries.forEach(entry => {{
                        if (entry.isIntersecting) {{
                            entry.target.style.width = entry.target.dataset.width;
                        }}
                    }});
                }});
                
                document.querySelectorAll('.progress-bar').forEach(bar => {{
                    bar.dataset.width = bar.style.width;
                    bar.style.width = '0';
                    observer.observe(bar);
                }});
            }});
        </script>
    </body>
    </html>
    """
    
    return html