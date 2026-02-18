export default function FooterBar() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} 我的博客. All rights reserved.</p>
      </div>

      <style>{`
        .footer {
          background-color: #f8f9fa;
          padding: 2rem 1rem;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer p {
          color: #666;
          margin: 0;
        }
      `}</style>
    </footer>
  )
}
