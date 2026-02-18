import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectStore } from '../store/projectStore'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getProjectById, setCurrentProject } = useProjectStore()

  useEffect(() => {
    if (id) {
      setCurrentProject(id)
    }
  }, [id, setCurrentProject])

  const project = id ? getProjectById(id) : null

  if (!project) {
    return (
      <div className="not-found">
        <h1>项目不存在</h1>
        <p>抱歉，您访问的项目不存在。</p>
        <Link to="/projects" className="btn btn-primary">
          返回项目列表
        </Link>

        <style>{`
          .not-found {
            text-align: center;
            padding: 4rem 0;
          }

          .not-found h1 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 0.5rem;
          }

          .not-found p {
            color: #666;
            margin-bottom: 2rem;
          }

          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
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

  return (
    <div className="project-detail">
      <header className="detail-header">
        <Link to="/projects" className="back-link">
          ← 返回项目列表
        </Link>
        <h1>{project.title}</h1>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <span className="meta-item">
            类型: {project.type === 'game' ? '游戏' : '工具'}
          </span>
          {project.placeholder && (
            <span className="meta-item placeholder-badge">
              占位页面
            </span>
          )}
        </div>
      </header>

      <section className="game-container">
        {project.placeholder ? (
          <div className="placeholder-message">
            <div className="placeholder-icon">🚧</div>
            <h2>项目开发中</h2>
            <p>此项目正在准备中，即将上线...</p>
            <p className="placeholder-note">
              后续将在此区域加载 {project.title} 的完整内容
            </p>
            <div className="placeholder-features">
              <h3>即将实现的功能：</h3>
              <ul>
                <li>完整的游戏/工具交互界面</li>
                <li>响应式设计，适配各种设备</li>
                <li>PWA 支持，可独立安装运行</li>
                <li>流畅的动画和用户体验</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="actual-content">
          </div>
        )}
      </section>

      <style>{`
        .project-detail {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .detail-header {
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .back-link {
          color: #42b883;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .detail-header h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .project-description {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .project-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          padding: 0.25rem 0.75rem;
          background: #f0f0f0;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #666;
        }

        .placeholder-badge {
          background: #fff3e0;
          color: #e65100;
        }

        .game-container {
          background: #f8f9fa;
          border-radius: 12px;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .placeholder-message {
          text-align: center;
          max-width: 500px;
        }

        .placeholder-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }

        .placeholder-message h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .placeholder-message p {
          color: #666;
          margin-bottom: 1rem;
        }

        .placeholder-note {
          font-size: 0.875rem;
          color: #999;
          font-style: italic;
        }

        .placeholder-features {
          margin-top: 2rem;
          text-align: left;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .placeholder-features h3 {
          font-size: 1rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .placeholder-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .placeholder-features li {
          padding: 0.5rem 0;
          color: #666;
          padding-left: 1.5rem;
          position: relative;
        }

        .placeholder-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #42b883;
        }

        @media (max-width: 768px) {
          .detail-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
