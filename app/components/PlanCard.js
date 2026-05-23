"use client";

import { useState } from "react";
import ChannelCarousel from "./ChannelCarousel";
import SubscribeCtaLink from "./SubscribeCtaLink";

const CARD_THEME = {
  music: {
    borderColor: "#6900ff",
    ctaBg: "#6900ff",
    ctaColor: "#ffffff",
  },
  access: {
    borderColor: "#31c8ff",
    ctaBg: "#31c8ff",
    ctaColor: "#000000",
  },
};

const ACCESS_BULLETS = [
  { lead: "Everything we offer:", items: [] },
  {
    items: [
      { bold: "Ad-free music", text: " curated by genre, decade, artist, and mood" },
      {
        bold: "Live NFL, MLB®, NBA, NHL®",
        text: ", and college games, plus NASCAR®, PGA TOUR, and more",
      },
      {
        bold: "Premium sports talk",
        text: ", including analysis, predictions, and fantasy sports",
      },
      {
        bold: "World and national news",
        text: " plus politics and issues",
      },
      {
        bold: "Celebrity-hosted talk shows",
        text: " and comedy",
      },
      {
        bold: "Exclusive video",
        text: " of in-studio interviews and performances",
      },
    ],
  },
];

function AddonToggle({ name, price }) {
  const [on, setOn] = useState(false);
  return (
    <div className="plancard_optionalItems">
      <span className="plancard_optionalItemHeading">{name}</span>
      <span className="plancard_optionalItemSubheading">{price}</span>
      <div className="plancard_toggleContainer">
        <div className="plancard_switchContainer">
          <button
            type="button"
            role="switch"
            aria-checked={on}
            className={`plancard_switchToggle${on ? " plancard_switchOn" : ""}`}
            onClick={() => setOn((v) => !v)}
          >
            <span className="plancard_circle" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanCard({
  variant,
  name,
  badge,
  subtitle,
  features,
  addons,
  promo,
  priceAfter,
  cta,
  channelIds,
  channelsLinkLabel,
}) {
  const theme = CARD_THEME[variant] ?? CARD_THEME.music;

  return (
    <div
      className="plancard_planCard plancard_bannerHidden"
      data-cy="plan-card"
      data-componenttype={`PlanCard-${name}`}
      style={{ "--card-border-color": theme.borderColor }}
    >
      <div className="plancard_headingSection">
        <span className="plancard_cardHeading">{name}</span>
        {badge && (
          <span className="plancard_badgeStyle plancard_cardEyebrow">{badge}</span>
        )}
        {subtitle && (
          <p className="plancard_cardDescription">{subtitle}</p>
        )}
        {features && (
          <div className="plancard_cardDescription plancard_bulletList">
            {ACCESS_BULLETS.map((block, i) => (
              <div key={i}>
                {block.lead && <span>{block.lead}</span>}
                {block.items?.length > 0 && (
                  <ul>
                    {block.items.map((item) => (
                      <li key={item.bold}>
                        <b>{item.bold}</b>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {addons && addons.length > 0 && (
        <>
          <p className="plancard_addOnLabel">
            Want more than music? Select your add-ons:
          </p>
          <div className="plancard_optionalItemWrapper">
            {addons.map((addon) => (
              <AddonToggle
                key={addon.name}
                name={addon.name}
                price={addon.price}
              />
            ))}
          </div>
        </>
      )}

      <div className="plancard_planPriceWrapper plancard_planPriceWrapperUnderCTA">
        <p>
          <b>{promo}</b> then {priceAfter}
        </p>
      </div>

      <div className="plancard_buttonWrapper plancard_buttonWrapperUnderCTA">
        <SubscribeCtaLink
          plan={name}
          className="plancard_button plancard_cta"
          style={{
            backgroundColor: theme.ctaBg,
            color: theme.ctaColor,
          }}
        >
          {cta}
        </SubscribeCtaLink>
      </div>

      <ChannelCarousel channelIds={channelIds} linkLabel={channelsLinkLabel} />
    </div>
  );
}
