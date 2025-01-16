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
import toggleBankHorizontalLogo from "@/public/banking/toggleBank_logo_horizontal_black.svg";
import frontierCapitalHorizontalLogo from "@/public/investment/frontier_capital_logo_horitzonal_black.svg";
import launchAirwaysHorizontalLogo from "@/public/airline/launch_airways_logo_horizontal_black.svg";
import galaxyMarketplaceHorizontalLogo from "@/public/marketplace/galaxy_marketplace_logo_horizontal.svg";
import vrgame from "@/public/marketplace/vrgalaxy_image/vrgame.svg";
import vrcamera from "@/public/marketplace/vrgalaxy_image/vrcamera.svg";
import vrheadset from "@/public/marketplace/vrgalaxy_image/vrheadset.svg";
import vrsoftware from "@/public/marketplace/vrgalaxy_image/vrsoftware.svg";
import vrtreadmill from "@/public/marketplace/vrgalaxy_image/vrtreadmill.svg";
import hapticgloves from "@/public/marketplace/vrgalaxy_image/hapticgloves.svg";
import vrheadsetcleaningkit from "@/public/marketplace/vrgalaxy_image/vrheadsetcleaningkit.svg";
import vrcontrollers from "@/public/marketplace/vrgalaxy_image/vrcontrollers.svg";
import { InventoryItem } from "@/utils/typescriptTypesInterfaceIndustry";
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

export const INVESTMENT = "investment";
export const MARKET = "market";
export const AIRLINES = "airlines";
export const BANK = "bank";

export const CLAUDE = "claude";
export const COHERE = "cohere";
export const META = "meta";


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

export const VR_GALAXY_DATA: InventoryItem[] = [
  {
    id: 1,
    vendor: "vrgalaxy",
    item: "VR Headset - Advanced Model",
    cost: "499.99",
    image: vrheadset,
  },
  {
    id: 2,
    vendor: "vrgalaxy",
    item: "Wireless VR Controllers (Pair)",
    cost: "119.99",
    image: vrcontrollers,
  },
  {
    id: 3,
    vendor: "vrgalaxy",
    item: "VR Treadmill for Immersive Movement",
    cost: "899.99",
    image: vrtreadmill,
  },
  {
    id: 4,
    vendor: "vrgalaxy",
    item: "Haptic Feedback Gloves",
    cost: "259.99",
    image: hapticgloves,
  },
  {
    id: 5,
    vendor: "vrgalaxy",
    item: "Virtual Reality Game - Space Adventure",
    cost: "59.99",
    image: vrgame,
  },
  {
    id: 6,
    vendor: "vrgalaxy",
    item: "VR Headset Cleaning Kit",
    cost: "29.99",
    image: vrheadsetcleaningkit,
  },
  {
    id: 7,
    vendor: "vrgalaxy",
    item: "360° VR Camera",
    cost: "349.99",
    image: vrcamera,
  },
  {
    id: 8,
    vendor: "vrgalaxy",
    item: "Virtual Reality Development Software",
    cost: "199.99",
    image: vrsoftware,
  },
  {
    id: 9,
    vendor: "vrgalaxy",
    item: "Adjustable VR Headset Stand",
    cost: "39.99",
  },
  {
    id: 10,
    vendor: "vrgalaxy",
    item: "Virtual Reality Experience Ticket - Underwater World",
    cost: "14.99",
  },
];

export const THE_BOOMIN_BOX_DATA: InventoryItem[] = [
  {
    id: 22,
    vendor: "boominbox",
    item: "Bluetooth Noise-Canceling Headphones",
    cost: "299.99",
  },
  {
    id: 23,
    vendor: "boominbox",
    item: "Wireless Earbuds - Waterproof Edition",
    cost: "159.99",
  },
  {
    id: 24,
    vendor: "boominbox",
    item: "High-Fidelity Turntable",
    cost: "349.99",
  },
  {
    id: 25,
    vendor: "boominbox",
    item: "Portable Bluetooth Speaker - Rugged Design",
    cost: "119.99",
  },
  {
    id: 26,
    vendor: "boominbox",
    item: "Studio Monitor Speakers (Pair)",
    cost: "499.99",
  },
  {
    id: 27,
    vendor: "boominbox",
    item: "Multi-Channel Home Theater System",
    cost: "999.99",
  },
  {
    id: 28,
    vendor: "boominbox",
    item: "Digital Audio Interface - Pro Series",
    cost: "229.99",
  },
  {
    id: 29,
    vendor: "boominbox",
    item: "Smart Home Sound System with Voice Control",
    cost: "399.99",
  },
  {
    id: 30,
    vendor: "boominbox",
    item: "Professional DJ Mixer",
    cost: "699.99",
  },
];

export const MACROCENTER_DATA: InventoryItem[] = [
  {
    id: 11,
    vendor: "macrocenter",
    item: "High-Performance Graphics Card - 8GB",
    cost: "699.99",
  },
  {
    id: 12,
    vendor: "macrocenter",
    item: "Gaming Motherboard - RGB Lighting",
    cost: "259.99",
  },
  {
    id: 13,
    vendor: "macrocenter",
    item: "Solid State Drive (SSD) - 1TB",
    cost: "129.99",
  },
  {
    id: 14,
    vendor: "macrocenter",
    item: "DDR4 RAM - 16GB Kit (2x8GB)",
    cost: "89.99",
  },
  {
    id: 15,
    vendor: "macrocenter",
    item: "Modular Power Supply - 750W",
    cost: "119.99",
  },
  {
    id: 16,
    vendor: "macrocenter",
    item: "CPU Cooler - Liquid Cooling System",
    cost: "139.99",
  },
  {
    id: 17,
    vendor: "macrocenter",
    item: "Full-Tower PC Case - Tempered Glass",
    cost: "199.99",
  },
  {
    id: 18,
    vendor: "macrocenter",
    item: "Wireless Gaming Keyboard and Mouse Combo",
    cost: "99.99",
  },
  {
    id: 19,
    vendor: "macrocenter",
    item: "27-inch Gaming Monitor - 144Hz",
    cost: "329.99",
  },
  {
    id: 20,
    vendor: "macrocenter",
    item: "Internal Sound Card - 7.1 Surround",
    cost: "79.99",
  },
];



export const HOMEPAGE_CARDS = {
  release: {
    name: "Automate Releases",
    description:
      "Increase developer productivity by using repeatable pipelines & workflows and  advanced targeting for canary testing",
    desktopNoHoveringImage: releaseNoHoverImage,
    desktopHoveringImage: releaseHoverImage,
    link: "/bank",
  },
  monitor: {
    name: "De-Risk releases",
    description:
      "Monitor critical metrics like errors and latency in real-time, instantly recover with auto-rollbacks and progressively rollout changes to target cohorts",
    desktopNoHoveringImage: monitorNoHoverImage,
    desktopHoveringImage: monitorHoverImage,
    link: "/investment",
  },
  ai: {
    name: "Accelerate AI",
    description:
      "Pivot to new models and configurations at runtime and roll back instantly when problems occur Measure the effectiveness of new GenAI features by rapidly experimenting with different prompts",
    desktopNoHoveringImage: aiNoHoverImage,
    desktopHoveringImage: aiHoverImage,
    link: "/airways",
  },
  experiment: {
    name: "Optimize Experiences",
    description:
      "Seamlessly integrate experimentation into the SDLC. Ship winning experiment variations in real-time without code changes",
    desktopNoHoveringImage: experimentNoHoverImage,
    desktopHoveringImage: experimentHoverImage,
    link: "/marketplace",
  },
};

export const DEFAULT_AI_MODEL = {
  messages: [
    {
      content:
        "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 100 characters. Here is the user prompt: ${userInput}.",
      role: "system",
    },
  ],
  model: {
    parameters: { temperature: 0.5, maxTokens: 500 },
    id: "cohere.command-text-v14",
  },
};

export const DEFAULT_AI_TRAVEL_PROMPT = {
  prompt: [
    {
      content:
        "Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${destination}, write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here. Place a hard limit on a 40 word response.Do not exceed this limit. do not specify word count in your reply",
      role: "system",
    },
  ],
};

export const CSNAV_ITEMS = {
  arrow: arrowIconCSNAV,
  codeexamples: {
    hoverBackground: codeexamplesHoverCSNAV,
    noHoverBackground: codeexamplesNoHoverCSNAV,
    icon: curlyBrackets,
    type: "resource",
    link: "/examples",
    title: "Code Examples",
  },
  architecture: {
    icon: architectureIconCSNAV,
    hoverBackground: architectureHoverCSNAV,
    noHoverBackground: architectureNoHoverCSNAV,
    type: "resource",
    link: "/architecture",
    title: "Architecture",
  },
  release: {
    icon: releaseIcon,
    hoverBackground: releaseHoverCSNAV,
    noHoverBackground: releaseNoHoverCSNAV,
    iconHover: releaseIconHover,
    type: "usecase",
    link: "/bank",
    title: "Automate Releases",
  },
  monitor: {
    icon: monitorIcon,
    hoverBackground: monitorHoverCSNAV,
    noHoverBackground: monitorNoHoverCSNAV,
    iconHover: monitorIconHover,
    type: "usecase",
    link: "/investment",
    title: "De-Risk Releases",
  },
  ai: {
    icon: aiIcon,
    hoverBackground: aiHoverCSNAV,
    noHoverBackground: aiNoHoverCSNAV,
    iconHover: aiIconHover,
    type: "usecase",
    link: "/airways",
    title: "Accelerate AI",
  },
  experiment: {
    icon: experimentIcon,
    hoverBackground: experimentHoverCSNAV,
    noHoverBackground: experimentNoHoverCSNAV,
    iconHover: experimentIconHover,
    type: "usecase",
    link: "/marketplace",
    title: "Optimize Experiences",
  },
};

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
