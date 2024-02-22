resource "launchdarkly_metric" "store-accessed" {
  project_key    = var.project_key
  key            = "store-accessed"
  name           = "Store Accessed"
  description    = "Customer Accessing Marketplace Store"
  kind           = "custom"
  is_numeric     = false
  event_key      = "store-accessed"
  success_criteria = "HigherThanBaseline"
  randomization_units = ["user"]
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
  randomization_units = ["user"]
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
  randomization_units = ["user"]
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
  randomization_units = ["user"]
  tags           = ["checkout"]
}