resource "launchdarkly_metric" "store-accessed" {
  project_key    = var.project_key
  key            = "store-accessed"
  name           = "Store Accessed"
  description    = "Customer Accessing Marketplace Store"
  kind           = "custom"
  is_numeric     = false
  event_key      = "store-accessed"
  success_criteria = "HigherThanBaseline"
  randomization_units = ["user", "audience"]
  tags           = ["store", "accessed"]
}

resource "launchdarkly_metric" "item-added" {
  project_key    = var.project_key
  key            = "item-added"
  name           = "Item Added to Cart"
  description    = "Customer added item to cart"
  kind           = "custom"
  is_numeric     = false
  event_key      = "item-added"
  success_criteria = "HigherThanBaseline"
  randomization_units = ["user", "audience"]
  tags           = ["item", "added", "cart"]
}

resource "launchdarkly_metric" "cart-accessed" {
  project_key    = var.project_key
  key            = "cart-accessed"
  name           = "Cart Accessed"
  description    = "Customer Accessing Shopping Cart"
  kind           = "custom"
  is_numeric     = false
  event_key      = "cart-accessed"
  success_criteria = "HigherThanBaseline"
  randomization_units = ["user", "audience"]
  tags           = ["cart", "accessed"]
}

resource "launchdarkly_metric" "customer-checkout" {
  project_key    = var.project_key
  key            = "customer-checkout"
  name           = "Customer Checkout"
  description    = "Customer Checking Out From Store"
  kind           = "custom"
  is_numeric     = false
  event_key      = "customer-checkout"
  success_criteria = "HigherThanBaseline"
  randomization_units = ["user", "audience"]
  tags           = ["checkout"]
}

resource "launchdarkly_metric" "stock-api-latency" {
  project_key    = var.project_key
  key            = "stock-api-latency"
  name           = "Stocks API Latency"
  description    = "Checking API Latency for Stocks"
  kind           = "custom"
  is_numeric     = true
  event_key      = "stock-api-latency"
  success_criteria = "LowerThanBaseline"
  randomization_units = ["audience"]
  unit           = "ms"
  tags           = ["release", "stocks", "api", "latency"]
}

resource "launchdarkly_metric" "stocks-api-error-rates" {
  project_key    = var.project_key
  key            = "stocks-api-error-rates"
  name           = "Stock API Error Rates"
  description    = "Error Rates for the Stocks API"
  kind           = "custom"
  is_numeric     = false
  event_key      = "stocks-api-error-rates"
  success_criteria = "LowerThanBaseline"
  randomization_units = ["audience"]
  tags           = ["release", "stocks", "api", "error", "rates"]
}
