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
import frontierCapitalHorizontalLogo from "@/public/investment/frontier_capital_logo_horitzonal.svg";
import launchAirwaysHorizontalLogo from "@/public/airline/launch_airways_logo_horizontal.svg";
import galaxyMarketplaceHorizontalLogo from "@/public/marketplace/galaxy_marketplace_logo_horizontal.svg";
import vrgame from "@/public/marketplace/vrgalaxy_image/vrgame.svg";
import vrcamera from "@/public/marketplace/vrgalaxy_image/vrcamera.svg";
import vrheadset from "@/public/marketplace/vrgalaxy_image/vrheadset.svg";
import vrsoftware from "@/public/marketplace/vrgalaxy_image/vrsoftware.svg";
import vrtreadmill from "@/public/marketplace/vrgalaxy_image/vrtreadmill.svg";
import hapticgloves from "@/public/marketplace/vrgalaxy_image/hapticgloves.svg";
import vrheadsetcleaningkit from "@/public/marketplace/vrgalaxy_image/vrheadsetcleaningkit.svg";
import vrcontrollers from "@/public/marketplace/vrgalaxy_image/vrcontrollers.svg";

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

export const VR_GALAXY_DATA = [
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

export const THE_BOOMIN_BOX_DATA = [
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

export const MACROCENTER_DATA = [
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
