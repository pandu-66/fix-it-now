export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-left">
          <h4 className="footer-logo">FixItNow</h4>
          <p>Making home maintenance hassle-free.</p>
        </div>

        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>

        <div className="footer-contact">
          <h5>Contact Support</h5>
          <p>
            Having trouble? <br />
            <a href="mailto:ejjineniraju@gmail.com" className="support-link">
              support@fixitnow.com
            </a>
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
        <p className="footer-version">v1.0.0</p>
      </div>
    </footer>
  );
}
