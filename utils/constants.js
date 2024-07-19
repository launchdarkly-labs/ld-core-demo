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

export const PERSONA_ROLE_STANARD = "Standard";
export const PERSONA_ROLE_BETA = "Beta";
export const PERSONA_ROLE_DEVELOPER = "Developer";
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
