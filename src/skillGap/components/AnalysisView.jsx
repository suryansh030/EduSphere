import { useState } from 'react';
import ProficiencyChart from './ProficiencyChart';
import RoadmapVisualization from './RoadmapVisualization';
import './AnalysisView.css';

function AnalysisView({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadingPortfolio, setDownloadingPortfolio] = useState(false);

  const API_BASE = 'http://localhost:5000';

  // Download Resume as PDF
  const downloadResume = async () => {
    setDownloadingResume(true);
    try {
      const response = await fetch(`${API_BASE}/api/generate-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate resume');
      }

      const blob = await response.blob();

      // Verify we got a valid blob
      if (blob.size === 0) {
        throw new Error('Received empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data.name || 'resume').replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ Resume downloaded successfully');
    } catch (error) {
      console.error('❌ Resume download error:', error);
      alert('Failed to download resume: ' + error.message);
    } finally {
      setDownloadingResume(false);
    }
  };

  // Download Portfolio as HTML
  const downloadPortfolio = async () => {
    setDownloadingPortfolio(true);
    try {
      const response = await fetch(`${API_BASE}/api/download-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate portfolio');
      }

      const blob = await response.blob();

      // Verify we got a valid blob
      if (blob.size === 0) {
        throw new Error('Received empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data.name || 'portfolio').replace(/\s+/g, '_')}_portfolio.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ Portfolio downloaded successfully');
    } catch (error) {
      console.error('❌ Portfolio download error:', error);
      alert('Failed to download portfolio: ' + error.message);
    } finally {
      setDownloadingPortfolio(false);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  // Get skill verification status color
  const getSkillStatusColor = (skill) => {
    if (skill.has_github_evidence || skill.verified) {
      if (skill.proficiency >= 80) return '#10b981'; // Green - Expert
      if (skill.proficiency >= 60) return '#3b82f6'; // Blue - Advanced
      if (skill.proficiency >= 40) return '#8b5cf6'; // Purple - Intermediate
      return '#6b7280'; // Gray - Beginner
    }
    return '#f59e0b'; // Orange - No evidence
  };

  // Get proficiency analysis data
  const proficiencyAnalysis = data.proficiency_analysis || {};
  const verifiedSkills = proficiencyAnalysis.github_verified_skills || [];
  const claimedNoEvidence = proficiencyAnalysis.claimed_no_evidence_skills || [];
  const extraDetected = proficiencyAnalysis.extra_detected_skills || [];

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <button onClick={onBack} className="back-btn">← Back to Form</button>
        <h1>{data.name}'s Portfolio Analysis</h1>
        <p className="subtitle">AI-Powered Career Insights</p>

        {/* Download Buttons Container */}
        <div className="download-buttons-container">
          <button
            onClick={downloadResume}
            className={`download-btn resume-btn ${downloadingResume ? 'loading' : ''}`}
            disabled={downloadingResume}
          >
            {downloadingResume ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              '📄 Download Resume (PDF)'
            )}
          </button>

          <button
            onClick={downloadPortfolio}
            className={`download-btn portfolio-btn ${downloadingPortfolio ? 'loading' : ''}`}
            disabled={downloadingPortfolio}
          >
            {downloadingPortfolio ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              '🌐 Download Portfolio (HTML)'
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-number">{proficiencyAnalysis.skills?.length || 0}</div>
          <div className="stat-label">Total Skills</div>
        </div>
        <div className="stat-card verified">
          <div className="stat-number">{verifiedSkills.length}</div>
          <div className="stat-label">GitHub Verified</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{claimedNoEvidence.length}</div>
          <div className="stat-label">No Evidence</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{extraDetected.length}</div>
          <div className="stat-label">Auto-Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {(data.projects?.length || 0) + (data.github_projects?.length || 0)}
          </div>
          <div className="stat-label">Projects</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          💡 Skills Analysis
        </button>
        <button
          className={`tab ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          🗺️ Career Roadmap
        </button>
        <button
          className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          💼 Opportunities
        </button>
        <button
          className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Industry Trends
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="info-card">
              <h2>Profile Summary</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Name:</strong> {data.name}
                </div>
                <div className="info-item">
                  <strong>Department:</strong> {data.department || 'Not specified'}
                </div>
                <div className="info-item">
                  <strong>Target Role:</strong> {data.target_role}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {data.email}
                </div>
                {data.phone && (
                  <div className="info-item">
                    <strong>Phone:</strong> {data.phone}
                  </div>
                )}
                {data.github_link && (
                  <div className="info-item">
                    <strong>GitHub:</strong>{' '}
                    <a href={data.github_link} target="_blank" rel="noopener noreferrer">
                      {data.github_link}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h2>Skills Overview</h2>
              <div className="skills-overview-container">
                {/* Verified Skills */}
                {verifiedSkills.length > 0 && (
                  <div className="skills-category">
                    <h4>✅ Verified Skills (Found in GitHub)</h4>
                    <div className="skills-grid">
                      {verifiedSkills.map((skill, idx) => (
                        <span key={idx} className="skill-badge verified">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Claimed but No Evidence */}
                {claimedNoEvidence.length > 0 && (
                  <div className="skills-category">
                    <h4>⚠️ Claimed Skills (No GitHub Evidence)</h4>
                    <div className="skills-grid">
                      {claimedNoEvidence.map((skill, idx) => (
                        <span key={idx} className="skill-badge unverified">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-Detected Skills */}
                {extraDetected.length > 0 && (
                  <div className="skills-category">
                    <h4>🔍 Auto-Detected Skills (Found in GitHub, not listed by you)</h4>
                    <div className="skills-grid">
                      {extraDetected.map((skill, idx) => (
                        <span key={idx} className="skill-badge auto-detected">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback if no categorized skills */}
                {verifiedSkills.length === 0 && claimedNoEvidence.length === 0 && extraDetected.length === 0 && (
                  <div className="skills-grid">
                    {data.skills && data.skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="info-card">
                <h2>Your Projects</h2>
                <div className="projects-grid">
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="project-card">
                      <h3>{project.title}</h3>
                      <p>{project.description || 'No description provided'}</p>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Projects */}
            {data.github_projects && data.github_projects.length > 0 && (
              <div className="info-card">
                <h2>GitHub Repositories</h2>
                <div className="projects-grid">
                  {data.github_projects.map((project, idx) => (
                    <div key={idx} className="project-card github-project">
                      <div className="project-header-info">
                        <h3>{project.name}</h3>
                        {project.stars > 0 && (
                          <span className="stars-badge">⭐ {project.stars}</span>
                        )}
                      </div>
                      <p>{project.description || 'No description available'}</p>
                      {project.languages && project.languages.length > 0 && (
                        <div className="project-languages">
                          {project.languages.slice(0, 5).map((lang, i) => (
                            <span key={i} className="lang-badge">{lang}</span>
                          ))}
                        </div>
                      )}
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.intro_video_url && extractVideoId(data.intro_video_url) && (
              <div className="info-card">
                <h2>Introduction Video</h2>
                <div className="video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(data.intro_video_url)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Introduction Video"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <div className="info-card">
              <h2>Skill Proficiency Analysis</h2>
              <p className="section-description">
                Based on your GitHub activity and project portfolio, here's a detailed analysis of your skill levels powered by AI.
                Skills are normalized (e.g., "html", "HTML", "Html" are treated as the same skill).
              </p>

              {proficiencyAnalysis.scale && (
                <div className="proficiency-scale">
                  <h3>Proficiency Scale</h3>
                  <div className="scale-grid">
                    {Object.entries(proficiencyAnalysis.scale).map(([range, desc]) => (
                      <div key={range} className="scale-item">
                        <span className="scale-range">{range}</span>
                        <span className="scale-desc">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="proficiency-chart-wrapper">
                <ProficiencyChart data={proficiencyAnalysis} />
              </div>

              {/* Verified Skills Summary */}
              {verifiedSkills.length > 0 && (
                <div className="success-box">
                  <h3>✅ GitHub Verified Skills ({verifiedSkills.length})</h3>
                  <p>These skills have been verified through your GitHub repositories:</p>
                  <div className="verified-skills">
                    {verifiedSkills.map((skill, idx) => (
                      <span key={idx} className="verified-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unverified Skills Warning */}
              {claimedNoEvidence.length > 0 && (
                <div className="warning-box">
                  <h3>⚠️ Skills Without GitHub Evidence ({claimedNoEvidence.length})</h3>
                  <p>
                    These skills you listed couldn't be verified through your GitHub profile:
                  </p>
                  <div className="unverified-skills">
                    {claimedNoEvidence.map((skill, idx) => (
                      <span key={idx} className="unverified-badge">{skill}</span>
                    ))}
                  </div>
                  <p className="suggestion">
                    💡 <strong>Tip:</strong> Add projects demonstrating these skills to strengthen your portfolio and get them verified.
                  </p>
                </div>
              )}

              {/* Extra Skills Found in GitHub */}
              {extraDetected.length > 0 && (
                <div className="info-box extra-skill-box">
                  <h3>🔎 Auto-Detected Skills ({extraDetected.length})</h3>
                  <p>These skills were found in your GitHub repositories even though you did not list them:</p>
                  <div className="skills-grid">
                    {extraDetected.map((skill, idx) => (
                      <span key={idx} className="skill-badge auto-skill">{skill}</span>
                    ))}
                  </div>
                  <p className="note">
                    💡 AI detected these from file usage, package.json, or language analysis. Consider adding them to your skill list!
                  </p>
                </div>
              )}

              {/* Detailed Skill Breakdown */}
              {/* Detailed Skill Breakdown */}
              {/* Detailed Skill Breakdown */}
              <div className="skills-detail">
                <h3>Detailed Skill Breakdown</h3>
                {proficiencyAnalysis.skills && proficiencyAnalysis.skills.length > 0 ? (
                  <div className="skills-detail-grid">
                    {proficiencyAnalysis.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="skill-detail-card"
                        style={{ borderLeftColor: getSkillStatusColor(skill) }}
                      >
                        <div className="skill-header">
                          <div className="skill-name-status">
                            <h4>{skill.name}</h4>
                            <span
                              className={`verification-status ${skill.has_github_evidence ? "verified" : "unverified"
                                }`}
                            >
                              {skill.has_github_evidence ? "✅ Verified" : "⚠️ No Evidence"}
                            </span>
                          </div>
                          <span
                            className={`level-badge level-${(skill.level || "")
                              .toLowerCase()
                              .replace(/\s+/g, "")}`}
                          >
                            {skill.level}
                          </span>
                        </div>

                        <div className="proficiency-bar-container">
                          <div
                            className="proficiency-bar-fill"
                            style={{
                              width: `${skill.proficiency}%`,
                              backgroundColor: getSkillStatusColor(skill)
                            }}
                          />
                          <span className="proficiency-text">
                            {skill.proficiency != null ? `${skill.proficiency}%` : "-"}
                          </span>
                        </div>

                        {skill.evidence && skill.evidence.length > 0 && (
                          <div className="evidence-list">
                            {skill.evidence.map((ev, i) => (
                              <div key={i} className="evidence-item">
                                {ev}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">
                    No detailed skill data available. Add a GitHub link to get AI-powered
                    skill analysis.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="roadmap-section">
            <div className="info-card">
              <h2>Your Career Roadmap to {data.target_role}</h2>
              <p className="section-description">
                Based on your current skills and target role, here are potential career paths you can pursue with recommended courses.
              </p>

              {data.roadmap && (
                <>
                  <div className="roadmap-summary">
                    <div className="position-box current">
                      <h3>📍 Current Position</h3>
                      <p>{data.roadmap.current_position}</p>
                    </div>
                    <div className="arrow">→</div>
                    <div className="position-box target">
                      <h3>🎯 Target Position</h3>
                      <p>{data.roadmap.target_position}</p>
                    </div>
                  </div>

                  {/* Required Skills */}
                  {data.roadmap.required_skills && data.roadmap.required_skills.length > 0 && (
                    <div className="required-skills-box">
                      <h4>📚 Required Skills for {data.target_role}:</h4>
                      <div className="skills-tags">
                        {data.roadmap.required_skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag required">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <RoadmapVisualization roadmap={data.roadmap} />

                  {data.roadmap.paths && data.roadmap.paths.map((path, idx) => (
                    <div key={idx} className="path-card">
                      <div className="path-header">
                        <h3>{path.path_name}</h3>
                        <div className="path-meta">
                          <span className={`difficulty ${path.difficulty?.toLowerCase()}`}>
                            {path.difficulty}
                          </span>
                          <span className="timeline">⏱ {path.timeline}</span>
                        </div>
                      </div>
                      <p className="path-description">{path.description}</p>

                      {path.steps && (
                        <div className="steps-container">
                          <h4>Steps to Follow:</h4>
                          {path.steps.map((step, stepIdx) => (
                            <div key={stepIdx} className="step-card">
                              <div className="step-number">{step.step_number}</div>
                              <div className="step-content">
                                <h5>{step.title}</h5>
                                {step.estimated_time && (
                                  <p className="step-time">⏱ {step.estimated_time}</p>
                                )}
                                {step.skills_to_learn && step.skills_to_learn.length > 0 && (
                                  <div className="step-skills">
                                    <strong>Skills to learn:</strong>
                                    <div className="skills-tags">
                                      {step.skills_to_learn.map((skill, i) => (
                                        <span key={i} className="skill-tag">{skill}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Display course links for each step */}
                                {step.courses && step.courses.length > 0 && (
                                  <div className="step-courses">
                                    <strong>📚 Recommended Courses:</strong>
                                    <div className="course-links">
                                      {step.courses.map((course, cIdx) => (
                                        <a
                                          key={cIdx}
                                          href={course.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-course-link"
                                        >
                                          <span className="course-icon">🎓</span>
                                          <div className="course-info">
                                            <span className="course-name">{course.name}</span>
                                            <span className="course-platform">{course.platform} • {course.level}</span>
                                          </div>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {(!data.roadmap || !data.roadmap.paths) && (
                <p className="no-data">No roadmap data available. Please try generating your portfolio again.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="opportunities-section">
            <div className="info-card">
              <h2>Job Opportunities</h2>
              <p className="section-description">
                Based on your skills, here are matching job opportunities across the web.
                Click any card to search for jobs on that platform.
              </p>

              {data.job_opportunities && data.job_opportunities.length > 0 ? (
                <div className="jobs-grid">
                  {data.job_opportunities.map((job, idx) => (
                    <a
                      key={idx}
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="job-card"
                    >
                      <div className="job-header">
                        <h3>{job.title}</h3>
                        <span className="job-platform">{job.platform}</span>
                      </div>
                      <p className="job-company">🏢 {job.company}</p>
                      <p className="job-location">📍 {job.location}</p>
                      {job.skills_matched && job.skills_matched.length > 0 && (
                        <div className="job-skills">
                          <strong>Matching Skills:</strong>
                          <div className="skills-tags">
                            {job.skills_matched.slice(0, 5).map((skill, i) => (
                              <span key={i} className="skill-tag matched">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <span className="apply-link">View Jobs →</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="no-data">No job opportunities found. Try adding more skills or adjusting your target role.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="trends-section">
            <div className="info-card">
              <h2>Industry Trends for {data.target_role}</h2>
              <p className="section-description">
                Latest trending skills and technologies in your field.
                See which trending skills you already have and which ones to consider learning.
              </p>

              {data.industry_trends && data.industry_trends.length > 0 ? (
                <div className="trends-grid">
                  {data.industry_trends.map((trend, idx) => (
                    <div
                      key={idx}
                      className={`trend-card ${trend.skill_status || (trend.has_skill ? 'verified' : 'not_learned')}`}
                    >
                      {(trend.skill_status === 'verified' || trend.has_skill) && (
                        <div className="checkmark">✓</div>
                      )}
                      <div className="trend-header">
                        <h3>{trend.skill}</h3>
                        <span className={`trend-badge trend-${trend.trend}`}>
                          {trend.trend === 'hot' && '🔥'}
                          {trend.trend === 'rising' && '📈'}
                          {trend.trend === 'stable' && '📊'}
                          {' '}{trend.trend}
                        </span>
                      </div>
                      <p className="trend-description">{trend.description}</p>

                      {/* Status Message */}
                      <div className={`skill-status-message ${trend.skill_status || ''}`}>
                        {trend.status_message || (
                          trend.has_skill
                            ? '✅ You already have this skill!'
                            : '📚 Consider learning this skill'
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">Loading industry trends...</p>
              )}

              {/* Trends Legend */}
              <div className="trends-legend">
                <h4>Legend:</h4>
                <div className="legend-items">
                  <span className="legend-item">
                    <span className="legend-dot verified"></span>
                    Verified in GitHub
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot claimed"></span>
                    Claimed (No Evidence)
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot not-learned"></span>
                    Not Yet Learned
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="analysis-footer">
        <p>Generated on {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>Powered by <strong>AI Portfolio Analyzer</strong> with Gemini AI</p>
      </div>
    </div>
  );
}

export default AnalysisView;