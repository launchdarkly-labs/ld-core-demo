import amazonLogo from "@/public/investment/stocks_logo/amazonLogo.png";
import appleLogo from "@/public/investment/stocks_logo/apple_circle_round icon_icon.svg";
import microsoftLogo from "@/public/investment/stocks_logo/microsoftLogo.svg";
import nvidiaLogo from "@/public/investment/stocks_logo/nvidiaLogo.svg";
import salesforceLogo from "@/public/investment/stocks_logo/salesforceLogo.svg";
import teslaLogo from "@/public/investment/stocks_logo/teslaLogo.svg";
import shopifyLogo from "@/public/investment/stocks_logo/shopify.svg";
import walmartLogo from "@/public/investment/stocks_logo/walmart_logo_icon.svg";
import avgoLogo from "@/public/investment/stocks_logo/AVGO.webp";
import toggleBankVerticalLogo from "@/public/banking/toggleBank_logo_vertical.svg";
import frontierCapitalVerticalLogo from "@/public/investment/frontier_capital_logo_vertical.svg";
import launchAirwaysVerticalLogo from "@/public/airline/launch_airways_logo_vertical.svg";
import galaxyMarketplaceVerticalLogo from "@/public/marketplace/galaxy_marketplace_logo_vertical.svg";
import toggleBankHorizontalLogo from "@/public/banking/toggleBank_logo_horizontal.svg";
import frontierCapitalHorizontalLogo from "@/public/investment/frontier_capital_logo_horitzonal_black.svg";
import launchAirwaysHorizontalLogo from "@/public/airline/launch_airways_logo_horizontal_black.svg";
import galaxyMarketplaceHorizontalLogo from "@/public/marketplace/galaxy_marketplace_logo_horizontal.svg";
import releaseHoverImage from "@/public/homepage/release-card-hovering.svg";
import releaseNoHoverImage from "@/public/homepage/release-card-not-hovering.svg";
import monitorHoverImage from "@/public/homepage/card-demo-desktop-monitorfeatures-hover.svg";
import monitorNoHoverImage from "@/public/homepage/card-demo-desktop-monitorfeatures.svg";
import aiHoverImage from "@/public/homepage/card-demo-desktop-accelerateai-hover.svg";
import aiNoHoverImage from "@/public/homepage/card-demo-desktop-accelerateai.svg";
import experimentHoverImage from "@/public/homepage/card-demo-desktop-experimenteverywhere-hover.svg";
import experimentNoHoverImage from "@/public/homepage/card-demo-desktop-experimenteverywhere.svg";
import architectureIconCSNAV from "@/public/sidenav/architecture-icon.svg";
import aiHoverCSNAV from "@/public/sidenav/card-demo-sidenav-accelerateai-hover.svg";
import aiNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-accelerateai.svg";
import architectureHoverCSNAV from "@/public/sidenav/card-demo-sidenav-architecture-hover.svg";
import architectureNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-architecture.svg";
import releaseHoverCSNAV from "@/public/sidenav/card-demo-sidenav-automatereleases-hover.svg";
import releaseNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-automatereleases.svg";
import codeexamplesHoverCSNAV from "@/public/sidenav/card-demo-sidenav-codeexamples-hover.svg";
import codeexamplesNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-codeexamples.svg";
import experimentHoverCSNAV from "@/public/sidenav/card-demo-sidenav-experimenteverywhere-hover.svg";
import experimentNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-experimenteverywhere.svg";
import monitorHoverCSNAV from "@/public/sidenav/card-demo-sidenav-monitorfeatures-hover.svg";
import monitorNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-monitorfeatures.svg";
import curlyBrackets from "@/public/sidenav/curly-brackets.svg";
import aiIconHover from "@/public/sidenav/illo-ai-hover.svg";
import aiIcon from "@/public/sidenav/illo-ai.svg";
import experimentIconHover from "@/public/sidenav/illo-experiment-hover.svg";
import experimentIcon from "@/public/sidenav/illo-experiment.svg";
import releaseIconHover from "@/public/sidenav/illo-release-1.svg";
import releaseIcon from "@/public/sidenav/illo-release.svg";
import monitorIconHover from "@/public/sidenav/illo-monitor-hover.svg";
import monitorIcon from "@/public/sidenav/illo-monitor.svg";
import arrowIconCSNAV from "@/public/sidenav/arrow.svg";

export const STOCK_LOGO_IMAGE = {
  TSLA: teslaLogo,
  AMZN: amazonLogo,
  AAPL: appleLogo,
  MSFT: microsoftLogo,
  NVDA: nvidiaLogo,
  AVGO: avgoLogo,
  SHOP: shopifyLogo,
  WMT: walmartLogo,
  CRM: salesforceLogo,
};

export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const PERSONA_TIER_STANARD = "Standard";
export const PERSONA_TIER_PLATINUM = "Platinum";
export const PERSONA_ROLE_BETA = "Beta";
export const PERSONA_ROLE_DEVELOPER = "Developer";
export const PERSONA_ROLE_USER = "User";
export const LAUNCH_CLUB_STANDARD = "standard";
export const LAUNCH_CLUB_PLATINUM = "platinum";

export const LD_CONTEXT_COOKIE_KEY = "ld-context";

export const HOMEPAGE_CARDS = {
  release: {
    name: "Automate Releases",
    description: "Increase developer productivity by using repeatable pipelines & workflows and  advanced targeting for canary testing",
    desktopNoHoveringImage: releaseNoHoverImage,
    desktopHoveringImage: releaseHoverImage,
    link: "/bank"
  },
  monitor: {
    name: "De-Risk releases",
    description: "Monitor critical metrics like errors and latency in real-time, instantly recover with auto-rollbacks and progressively rollout changes to target cohorts",
    desktopNoHoveringImage: monitorNoHoverImage,
    desktopHoveringImage: monitorHoverImage,
    link: "/investment"
  },
  ai: {
    name: "Safely Ship AI",
    description: "Pivot to new models and configurations at runtime and roll back instantly when problems occur Measure the effectiveness of new GenAI features by rapidly experimenting with different prompts",
    desktopNoHoveringImage: aiNoHoverImage,
    desktopHoveringImage: aiHoverImage,
    link: "/airways"
  },
  experiment: {
    name: "Optimize Experiences",
    description: "Seamlessly integrate experimentation into the SDLC. Ship winning experiment variations in real-time without code changes",
    desktopNoHoveringImage: experimentNoHoverImage,
    desktopHoveringImage: experimentHoverImage,
    link: "/marketplace"
  }
};

export const COMPANY_LOGOS = {
  bank: {
    vertical: toggleBankVerticalLogo,
    horizontal: toggleBankHorizontalLogo,
  },
  investment: {
    vertical: frontierCapitalVerticalLogo,
    horizontal: frontierCapitalHorizontalLogo,
  },
  airlines: {
    vertical: launchAirwaysVerticalLogo,
    horizontal: launchAirwaysHorizontalLogo,
  },
  market: {
    vertical: galaxyMarketplaceVerticalLogo,
    horizontal: galaxyMarketplaceHorizontalLogo,
  },
};

export const CSNAV_ITEMS = {

  arrow: arrowIconCSNAV,
  codeexamples: {
    hoverBackground: codeexamplesHoverCSNAV,
    noHoverBackground: codeexamplesNoHoverCSNAV,
    icon: curlyBrackets,
    type: "resource",
    link: "/examples",
    title: "Code Examples"
  },
  architecture: {
    icon: architectureIconCSNAV,
    hoverBackground: architectureHoverCSNAV,
    noHoverBackground: architectureNoHoverCSNAV,
    type: "resource",
    link: "/architecture",
    title: "Architecture"
  },
  release: {
    icon: releaseIcon,
    hoverBackground: releaseHoverCSNAV,
    noHoverBackground: releaseNoHoverCSNAV,
    iconHover: releaseIconHover,
    type: "usecase",
    link: "/bank",
    title: "Automate Releases"
  },
  monitor: {
    icon: monitorIcon,
    hoverBackground: monitorHoverCSNAV,
    noHoverBackground: monitorNoHoverCSNAV,
    iconHover: monitorIconHover,
    type: "usecase",
    link: "/investment",
    title: "De-Risk releases"
  },
  ai: {
    icon: aiIcon,
    hoverBackground: aiHoverCSNAV,
    noHoverBackground: aiNoHoverCSNAV,
    iconHover: aiIconHover,
    type: "usecase",
    link: "/airways",
    title: "Safely Ship AI"
  },
  experiment: {
    icon: experimentIcon,
    hoverBackground: experimentHoverCSNAV,
    noHoverBackground: experimentNoHoverCSNAV,
    iconHover: experimentIconHover,
    type: "usecase",
    link: "/marketplace",
    title: "Optimize Experiences"
  }
  

}

export const NAV_ELEMENTS_VARIANT = {
  bank: {
    navLinks: [
      {
        text: "Summary",
        href: "/bank",
      },
      { text: "Transfers", href: "/bank" },
      { text: "Deposits", href: "/bank" },
      { text: "External Accounts", href: "/bank" },
      { text: "Statements", href: "/bank" },
    ],
    navLinkColor: "gradient-bank",
    popoverMessage: "Thank you for banking with us, ",
    logoImg: COMPANY_LOGOS["bank"].horizontal,
  },
  investment: {
    navLinks: [
      { text: "Accounts & Trade", href: "/investment" },
      { text: "Planning", href: "/investment" },
      { text: "News", href: "/investment" },
      { text: "Investment Products", href: "/investment" },
      { text: "About Us", href: "/investment" },
    ],
    navLinkColor: "gradient-investment",
    popoverMessage: "Thank you for investing with us, ",
    logoImg: COMPANY_LOGOS["investment"].horizontal,
  },
  market: {
    navLinks: [
      { text: "All", href: "/marketplace" },
      { text: "Account", href: "/marketplace" },
      { text: "Buy Again", href: "/marketplace" },
      { text: "Today's Deals", href: "/marketplace" },
      { text: "Sale", href: "/marketplace" },
    ],
    navLinkColor: "gradient-experimentation",
    popoverMessage: "Thank you for shopping with us, ",
    logoImg: COMPANY_LOGOS["market"].horizontal,
  },
  airlines: {
    navLinks: [
      { text: "Book", href: "/airways" },
      { text: "Check-In", href: "/airways" },
    ],
    navLinkColor: "gradient-airline-buttons",
    popoverMessage: "Thank you for flying with us, ",
    logoImg: COMPANY_LOGOS["airlines"].horizontal,
  },
};
