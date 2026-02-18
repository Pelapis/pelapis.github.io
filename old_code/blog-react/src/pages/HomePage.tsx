import { Link } from 'react-router-dom'
import { useProjectStore } from '../store/projectStore'

export default function HomePage() {
  const { projects } = useProjectStore()

  return (
    <div className="home">
      <section className="hero">
        <h1>欢迎来到我的个人博客</h1>
        <p className="hero-subtitle">这里展示了我的项目和游戏作品</p>
      </section>

      <section className="projects-section">
        <div className="projects-grid">
          {projects.map(project => (
            <article key={project.id} className="project-card">
              <div className="project-icon">
                {project.type === 'game' && '🎮'}
                {project.type === 'tool' && '🛠️'}
                {project.type === 'other' && '📦'}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <Link to={`/project/${project.id}`} className="project-link">
                立即体验 →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .home {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero {
          text-align: center;
          padding: 1.5rem 0;
        }

        .hero h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.75rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #666;
        }

        .projects-section {
          padding-top: 1rem;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .project-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .project-icon {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
        }

        .project-card h3 {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .project-card p {
          color: #666;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .project-link {
          color: #42b883;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .project-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .projects-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
