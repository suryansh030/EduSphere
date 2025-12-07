import { useState } from 'react';
import './RoadmapVisualization.css';

function RoadmapVisualization({ roadmap }) {
  const [selectedPath, setSelectedPath] = useState(0);

  if (!roadmap || !roadmap.paths || roadmap.paths.length === 0) {
    return <div>No roadmap data available</div>;
  }

  return (
    <div className="roadmap-visualization">
      <div className="roadmap-tree">
        <div className="tree-container">
          {/* Central node - Current Position */}
          <div className="central-node">
            <div className="node current-node">
              <h4>Current</h4>
              <p>{roadmap.current_position}</p>
            </div>
          </div>

          {/* Path branches */}
          <div className="paths-container">
            {roadmap.paths.map((path, idx) => (
              <div
                key={idx}
                className={`path-branch ${selectedPath === idx ? 'active' : ''}`}
                onClick={() => setSelectedPath(idx)}
              >
                <div className="branch-line" />
                <div className="node path-node">
                  <h4>{path.path_name}</h4>
                  <p className="path-difficulty">{path.difficulty}</p>
                  <p className="path-timeline">{path.timeline}</p>
                </div>

                {selectedPath === idx && path.steps && (
                  <div className="steps-tree">
                    {path.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="step-node">
                        <div className="step-connector" />
                        <div className="node step-bubble">
                          <span className="step-num">{step.step_number}</span>
                          <h5>{step.title}</h5>
                          {step.estimated_time && (
                            <p className="step-time">{step.estimated_time}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Target node */}
          <div className="target-node-container">
            <div className="node target-node">
              <h4>Target</h4>
              <p>{roadmap.target_position}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="roadmap-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <span className="legend-box current-box"></span>
          <span>Your Current Position</span>
        </div>
        <div className="legend-item">
          <span className="legend-box path-box"></span>
          <span>Available Career Paths</span>
        </div>
        <div className="legend-item">
          <span className="legend-box target-box"></span>
          <span>Target Role</span>
        </div>
        <p className="legend-note">Click on any path to see detailed steps</p>
      </div>
    </div>
  );
}

export default RoadmapVisualization;