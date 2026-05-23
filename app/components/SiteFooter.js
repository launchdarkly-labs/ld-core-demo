const FOOTER_LINKS = {
  "Get SiriusXM": [
    "In-car and App Plans",
    "Try SiriusXM for Free",
    "Military Discount",
    "Student Plan",
    "Shop Radios",
  ],
  "Account Management": [
    "Sign In",
    "Create Account",
    "Make a Payment",
    "Transfer Subscription",
    "Request Radio Signal",
  ],
  "Customer Support": [
    "Contact Us",
    "Frequently Asked Questions",
    "Help Center",
  ],
};

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title} className="footer-col">
            <h4>{title}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="footer-offer" id="offer-details">
        <strong>OFFER DETAILS:</strong> The subscription plan you choose will{" "}
        <strong>automatically renew</strong> and you will be charged at then-current
        rates until you cancel. Credit card required. Cancel at least 24 hours prior
        to renewal. Channel lineup varies by package. Offer available to new
        subscribers and qualifying ESN/Device IDs as determined solely by SiriusXM.
      </p>
      <div className="footer-legal">
        <a href="#">Website Terms</a>
        <a href="#">Customer Agreement</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Your Privacy Choices</a>
      </div>
      <p className="footer-copy">©2026 Sirius XM Radio LLC</p>
    </footer>
  );
}
