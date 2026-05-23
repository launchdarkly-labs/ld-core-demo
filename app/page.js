import SiteHeader from "./components/SiteHeader";
import PlanCard from "./components/PlanCard";
import SubscribeCtaLink from "./components/SubscribeCtaLink";
import FaqSection from "./components/FaqSection";
import SiteFooter from "./components/SiteFooter";

const IN_CAR_PLANS = [
  {
    variant: "music",
    name: "All Music",
    badge: "Car + app",
    subtitle: "Curated by genre, decade, artist, and mood",
    addons: [
      { name: "Sports", price: "$8 more/mo." },
      { name: "News", price: "$5 more/mo." },
      { name: "Talk", price: "$5 more/mo." },
    ],
    promo: "$1 for 3 months",
    priceAfter: "$11.99/mo.",
    cta: "Get All Music",
    channelIds: ["hits-1", "alt-nation", "the-highway", "hip-hop-nation"],
    channelsLinkLabel: "View popular add-on channels",
  },
  {
    variant: "access",
    name: "All Access",
    badge: "Car + app",
    subtitle: "",
    features: [
      "Ad-free music curated by genre, decade, artist, and mood",
      "Live NFL, MLB®, NBA, NHL®, and college games, plus NASCAR®, PGA TOUR, and more",
      "Premium sports talk, including analysis, predictions, and fantasy sports",
      "World and national news plus politics and issues",
      "Celebrity-hosted talk shows and comedy",
      "Exclusive video of in-studio interviews and performances",
    ],
    promo: "$1 for 3 months",
    priceAfter: "$25.99/mo.",
    cta: "Get All Access",
    channelIds: ["fm-radio", "espn", "mad-dog", "pga-tour", "nfl"],
    channelsLinkLabel: "View popular All Access channels",
  },
];

const ORIGINALS = [
  {
    tag: "Music & Talk",
    title: "Get your fill of Unwell",
    desc: "Tap into two new SiriusXM Channels with live shows featuring Alex Cooper's signature mix of bold conversation, relatable storytelling, and trend-defining music picks.",
    channel: "Unwell Music (CH 3) & Unwell On Air (Streaming)",
    image: "linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #6c3483 100%)",
  },
  {
    tag: "Comedy",
    title: "Stand-Up on CONAN with Laurie Kilmartin",
    desc: "Laurie plays stand-up sets from Conan O'Brien's TV shows, and shares her behind-the-scenes expertise (CH 104).",
    channel: "CH 104",
    image: "linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)",
  },
  {
    tag: "Music",
    title: "Life with John Mayer",
    desc: "Tune in for an unparalleled music experience, featuring a handpicked mix of his favorite music, collaborations, and never-before-heard material (CH 14).",
    channel: "CH 14",
    image: "linear-gradient(135deg, #3498db 0%, #2c3e50 100%)",
  },
  {
    tag: "Talk",
    title: "It's Me, Tinx Live",
    desc: "The \"big sister\" of TikTok dives into all the hot topics and burning questions you want to hear about, as well as her satirical takes on pop culture (CH 102).",
    channel: "CH 102",
    image: "linear-gradient(135deg, #e056fd 0%, #686de0 100%)",
  },
  {
    tag: "Sports",
    title: "Stephen A. live and unfiltered",
    desc: "Every debate, every hot take, every moment that gets people talking. Hear Stephen A. live on Mad Dog Sports Radio (CH 82).",
    channel: "CH 82",
    image: "linear-gradient(135deg, #1e3799 0%, #0c2461 100%)",
  },
];

export default function PlansPage() {
  return (
    <>
      <div className="hero-shell">
        <SiteHeader />
        <section className="hero" id="discover">
          <h1 className="hero_title">
            We&apos;re all about what <strong>YOU</strong> want to hear
          </h1>
          <p className="hero_lead">
            Music, Sports, News, Talk. Our plans let you choose the variety
            you&apos;re looking for—and where you want to listen.
          </p>
        </section>
      </div>

      <main className="page-main">
        <section className="plans-block styledContainer" id="plans">
          <div className="plancardgroup_mainWrapper">
            <div className="plancardgroup_headlineWrapper">
              <h2 className="plancardgroup_headlineStyles">
                <span>Our popular in-car plans</span>
              </h2>
              <p className="plancardgroup_subheadlineStyles">
                Includes radio service and listening with the SiriusXM app on your
                devices. Subscribe now and get your first{" "}
                <b>3 months for $1</b>.{" "}
                <a href="#offer-details">See Offer Details</a>.
              </p>
            </div>
            <div
              className="plancardgroup_plancardWrapper"
              aria-label="In-car subscription plans"
            >
              {IN_CAR_PLANS.map((plan) => (
                <PlanCard key={plan.name} {...plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="streaming-block" id="subscribe">
          <h2>Want streaming only?</h2>
          <div className="streaming-card plancard plancard--access plancard--streaming">
            <h3 className="plancard_cardHeading">All Access (App Only)</h3>
            <p className="plancard_cardDescription">
              Get everything we offer. Listen exclusively on your home and mobile
              devices. See <a href="#offer-details">Offer Details</a>.
            </p>
            <p className="plancard_pricing">
              <strong>$1 for 3 months</strong>
              <span className="plancard_pricingThen"> then $11.99/mo.</span>
            </p>
            <SubscribeCtaLink plan="All Access (App Only)" className="plancard_cta">
              Get All Access (App Only)
            </SubscribeCtaLink>
          </div>
          <p className="streaming-promo">Subscribe now for $1 for 3 months!</p>
          <a href="#plans" className="jump-to-plans">
            Jump to plans
          </a>
        </section>

        <section className="originals-block" id="channels">
          <h2>SiriusXM Originals</h2>
          <p className="originals-lead">
            New and trending originals. Only on SiriusXM.
          </p>
          <div className="originals-scroller">
            {ORIGINALS.map((item) => (
              <article key={item.title} className="original-card">
                <div
                  className="original-card-image"
                  style={{ background: item.image }}
                  role="img"
                  aria-label=""
                />
                <div className="original-card-body">
                  <span className="original-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <p className="original-channel">
                    <strong>{item.channel}</strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FaqSection />
      </main>

      <aside className="feedback-tab" aria-hidden>
        Feedback
      </aside>
      <a href="#help" className="chat-widget" aria-label="Need help?">
        ?
      </a>

      <SiteFooter />
    </>
  );
}
