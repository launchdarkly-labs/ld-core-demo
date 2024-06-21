import amazonLogo from "@/public/investment/stocks_logo/amazonLogo.png";
import appleLogo from "@/public/investment/stocks_logo/apple_circle_round icon_icon.svg";
import microsoftLogo from "@/public/investment/stocks_logo/microsoftLogo.svg";
import nvidiaLogo from "@/public/investment/stocks_logo/nvidiaLogo.svg";
import salesforceLogo from "@/public/investment/stocks_logo/salesforceLogo.svg";
import teslaLogo from "@/public/investment/stocks_logo/teslaLogo.svg";
import shopifyLogo from "@/public/investment/stocks_logo/shopify.svg";
import walmartLogo from "@/public/investment/stocks_logo/walmart_logo_icon.svg";
import avgoLogo from "@/public/investment/stocks_logo/AVGO.webp";

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

export const STANDARD = "standard";

export const LD_CONTEXT_COOKIE_KEY = "ld-context"