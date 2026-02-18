export default function AboutPage() {
    return (
        <div className="about">
            <header className="page-header">
                <h1>关于我</h1>
                <p>了解一下我和这个博客</p>
            </header>

            <section className="about-content">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <span>👨‍💻</span>
                    </div>
                    <div className="profile-info">
                        <h2>你好，我是...</h2>
                        <p>
                            这是一个展示我的项目和游戏作品的个人博客。
                            我热爱编程，喜欢开发各种有趣的应用和游戏。
                        </p>
                        <p>
                            这个博客使用现代前端技术构建，包括 React、TypeScript、Zustand 和 Vite。
                            所有项目都采用响应式设计，支持移动端和桌面端访问。
                        </p>
                    </div>
                </div>

                <div className="tech-stack">
                    <h2>技术栈</h2>
                    <div className="tech-grid">
                        <div className="tech-item">
                            <span className="tech-icon">⚡</span>
                            <span className="tech-name">React</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">📘</span>
                            <span className="tech-name">TypeScript</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">🗃️</span>
                            <span className="tech-name">Zustand</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">🚀</span>
                            <span className="tech-name">Vite</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">📱</span>
                            <span className="tech-name">PWA</span>
                        </div>
                        <div className="tech-item">
                            <span className="tech-icon">🎨</span>
                            <span className="tech-name">CSS3</span>
                        </div>
                    </div>
                </div>

                <div className="features-section">
                    <h2>博客特性</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">📱</span>
                            <h3>移动端优先</h3>
                            <p>采用响应式设计，在各种设备上都有良好的浏览体验</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">⚡</span>
                            <h3>PWA 支持</h3>
                            <p>项目可作为独立应用安装到设备上，离线也能访问</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🎮</span>
                            <h3>游戏作品</h3>
                            <p>包含多种有趣的小游戏，随时可以开始游玩</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🔧</span>
                            <h3>实用工具</h3>
                            <p>提供各种实用的在线工具，方便日常工作生活</p>
                        </div>
                    </div>
                </div>

                <div className="contact-section">
                    <h2>联系我</h2>
                    <p>如果你有任何问题或建议，欢迎通过以下方式联系：</p>
                    <div className="contact-links">
                        <a href="https://github.com" target="_blank" rel="noopener" className="contact-link">
                            <span className="contact-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                        <a href="mailto:example@email.com" className="contact-link">
                            <span className="contact-icon">📧</span>
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
        .about {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          padding: 2rem 0 3rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #666;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .profile-section {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
          min-width: 250px;
        }

        .profile-info h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .profile-info p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .tech-stack h2,
        .features-section h2,
        .contact-section h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .tech-grid {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .tech-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        .tech-item:hover {
          transform: translateY(-2px);
        }

        .tech-icon {
          font-size: 1.25rem;
        }

        .tech-name {
          font-weight: 500;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .feature-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: #666;
          font-size: 0.9rem;
        }

        .contact-section {
          text-align: center;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .contact-section p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .contact-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .contact-icon {
          font-size: 1.25rem;
        }

        @media (max-width: 768px) {
          .profile-section {
            flex-direction: column;
            text-align: center;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
        </div>
    )
}
