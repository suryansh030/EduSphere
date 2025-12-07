import { useState } from 'react';
import './ProfileForm.css';

function ProfileForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    skills: '',
    github_link: '',
    target_role: '',
    intro_video_url: '',
    projects: [{ title: '', description: '', link: '' }]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData(prev => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', link: '' }]
    }));
  };

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, projects: newProjects }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.skills.trim()) {
      newErrors.skills = 'Please enter at least one skill';
    }
    
    if (!formData.target_role.trim()) {
      newErrors.target_role = 'Target role is required';
    }
    
    if (formData.github_link && !formData.github_link.includes('github.com')) {
      newErrors.github_link = 'Please enter a valid GitHub URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizeSkills = (skillsString) => {
    // Split by comma, trim whitespace, filter empty, and remove duplicates (case-insensitive)
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s);
    
    // Remove duplicates case-insensitively while preserving the first occurrence's case
    const seen = new Map();
    const uniqueSkills = [];
    
    for (const skill of skills) {
      const lowerSkill = skill.toLowerCase();
      if (!seen.has(lowerSkill)) {
        seen.set(lowerSkill, true);
        uniqueSkills.push(skill);
      }
    }
    
    return uniqueSkills;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Process skills into array with normalization
    const processedData = {
      ...formData,
      skills: normalizeSkills(formData.skills),
      projects: formData.projects.filter(p => p.title.trim())
    };
    
    console.log('Submitting data:', processedData);
    onSubmit(processedData);
  };

  return (
    <div className="profile-form-container">
      <div className="form-header">
        <h1>🚀 AI Portfolio Generator</h1>
        <p>Fill in your details to generate an intelligent portfolio analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>📋 Personal Information</h2>
          
          <div className="form-field">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Department / Field of Study</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science, Software Engineering"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>💡 Skills & Experience</h2>
          
          <div className="form-field">
            <label>Your Skills * (comma-separated)</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Python, Node.js, MongoDB"
              rows="3"
              className={errors.skills ? 'error' : ''}
              disabled={isLoading}
            />
            <small>
              Enter skills separated by commas. Don't worry about capitalization - 
              we'll handle it! (e.g., "html, CSS, JavaScript" are all valid)
            </small>
            {errors.skills && <span className="error-message">{errors.skills}</span>}
          </div>

          <div className="form-field">
            <label>GitHub Profile URL</label>
            <input
              type="url"
              name="github_link"
              value={formData.github_link}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
              className={errors.github_link ? 'error' : ''}
              disabled={isLoading}
            />
            <small>We'll analyze your repositories to verify skills and assess proficiency</small>
            {errors.github_link && <span className="error-message">{errors.github_link}</span>}
          </div>

          <div className="form-field">
            <label>Target Role *</label>
            <input
              type="text"
              name="target_role"
              value={formData.target_role}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer, Data Scientist, DevOps Engineer"
              className={errors.target_role ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.target_role && <span className="error-message">{errors.target_role}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>🚀 Projects</h2>
          
          {formData.projects.map((project, index) => (
            <div key={index} className="project-input">
              <div className="project-header">
                <h3>Project {index + 1}</h3>
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="remove-btn"
                    disabled={isLoading}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className="form-field">
                <label>Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  placeholder="Project name"
                  disabled={isLoading}
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  placeholder="Brief description of the project, technologies used, your role..."
                  rows="3"
                  disabled={isLoading}
                />
              </div>

              <div className="form-field">
                <label>Project Link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  placeholder="https://github.com/your-project or https://project-demo.com"
                  disabled={isLoading}
                />
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addProject} 
            className="add-project-btn"
            disabled={isLoading}
          >
            + Add Another Project
          </button>
        </div>

        <div className="form-section">
          <h2>🎬 Introduction Video</h2>
          
          <div className="form-field">
            <label>YouTube Video URL (Optional)</label>
            <input
              type="url"
              name="intro_video_url"
              value={formData.intro_video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              disabled={isLoading}
            />
            <small>Add a video introduction to showcase your personality and communication skills</small>
          </div>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing Portfolio...
            </>
          ) : (
            '🔍 Generate Portfolio & Analysis'
          )}
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;