import { Link } from 'react-router-dom'
import { useProjectStore } from '../store/projectStore'
import { useMemo } from 'react'

export default function ProjectsPage() {
  const { projects } = useProjectStore()

  const games = useMemo(() =>
    projects.filter(p => p.type === 'game'),
    [projects]
  )

  const tools = useMemo(() =>
    projects.filter(p => p.type === 'tool'),
    [projects]
  )

  return (
    <div className="projects">
      <header className="page-header">
        <h1>我的项目</h1>
        <p>这里展示了我开发的各种项目和游戏</p>
      </header>

      {games.length > 0 && (
        <section className="project-section">
          <h2>🎮 游戏</h2>
          <div className="projects-grid">
            {games.map(project => (
              <article key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <span className="placeholder-icon">🕹️</span>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    <span className="tag">游戏</span>
                    {project.placeholder && <span className="tag placeholder">占位</span>}
                  </div>
                  <Link to={`/project/${project.id}`} className="btn btn-primary">
                    开始游戏
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section className="project-section">
          <h2>🛠️ 工具</h2>
          <div className="projects-grid">
            {tools.map(project => (
              <article key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <span className="placeholder-icon">🔧</span>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    <span className="tag">工具</span>
                    {project.placeholder && <span className="tag placeholder">占位</span>}
                  </div>
                  <Link to={`/project/${project.id}`} className="btn btn-primary">
                    使用工具
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .projects {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .page-header {
          text-align: center;
          padding: 2rem 0;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #666;
        }

        .project-section h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .project-thumbnail {
          height: 160px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 4rem;
        }

        .project-content {
          padding: 1.5rem;
        }

        .project-content h3 {
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .project-content p {
          color: #666;
          margin-bottom: 1rem;
        }

        .project-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .tag.placeholder {
          background: #fff3e0;
          color: #e65100;
        }

        .btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #42b883;
          color: white;
        }

        .btn-primary:hover {
          background: #3aa876;
        }
      `}</style>
    </div>
  )
}
