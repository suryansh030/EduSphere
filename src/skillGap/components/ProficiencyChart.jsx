import { useEffect, useRef } from 'react';
import './ProficiencyChart.css';

function ProficiencyChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !data.skills) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const skills = data.skills.slice(0, 10); // Top 10 skills

    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart settings
    const barHeight = 40;
    const barSpacing = 15;
    const leftMargin = 150;
    const rightMargin = 80;
    const topMargin = 30;
    const maxBarWidth = width - leftMargin - rightMargin;

    // Draw title
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#1e40af';
    ctx.fillText('Top Skills Proficiency', 20, 20);

    // Draw bars
    skills.forEach((skill, index) => {
      const y = topMargin + index * (barHeight + barSpacing);
      const barWidth = (skill.proficiency / 100) * maxBarWidth;

      // Draw skill name
      ctx.font = '14px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'right';
      ctx.fillText(skill.name, leftMargin - 10, y + barHeight / 2 + 5);

      // Determine color based on proficiency
      let color;
      if (skill.proficiency >= 80) {
        color = '#10b981'; // Green for expert
      } else if (skill.proficiency >= 60) {
        color = '#3b82f6'; // Blue for advanced
      } else if (skill.proficiency >= 40) {
        color = '#f59e0b'; // Orange for intermediate
      } else if (skill.proficiency >= 20) {
        color = '#ef4444'; // Red for elementary
      } else {
        color = '#9ca3af'; // Gray for beginner
      }

      // Draw bar background
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(leftMargin, y, maxBarWidth, barHeight);

      // Draw bar
      const gradient = ctx.createLinearGradient(leftMargin, 0, leftMargin + barWidth, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + 'cc');
      ctx.fillStyle = gradient;
      ctx.fillRect(leftMargin, y, barWidth, barHeight);

      // Draw percentage
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      if (barWidth > 50) {
        ctx.fillText(`${skill.proficiency}%`, leftMargin + 10, y + barHeight / 2 + 5);
      } else {
        ctx.fillStyle = '#333';
        ctx.fillText(`${skill.proficiency}%`, leftMargin + barWidth + 10, y + barHeight / 2 + 5);
      }

      // Draw level badge
      ctx.font = '11px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'right';
      ctx.fillText(skill.level, width - 10, y + barHeight / 2 + 5);
    });

    ctx.textAlign = 'left';
  }, [data]);

  if (!data || !data.skills || data.skills.length === 0) {
    return (
      <div className="chart-container">
        <p>No proficiency data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas
        ref={chartRef}
        width={800}
        height={650}
        className="proficiency-canvas"
      />
    </div>
  );
}

export default ProficiencyChart;