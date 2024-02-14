resource "launchdarkly_feature_flag" "federatedAccounts" {
  project_key = var.project_key
  key         = "federatedAccounts"
  name        = "01 - Release Federated Account Access"
  description = "Release New External Account Federation"

  variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "release"
  ]
}


resource "launchdarkly_feature_flag" "stocksAPI" {
  project_key = var.project_key
  key         = "stocksAPI"
  name        = "11 - Release Stocks API"
  description = "Release New Stocks API"

  variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "release"
  ]
}

resource "launchdarkly_feature_flag" "wealthManagement" {
  project_key = var.project_key
  key         = "wealthManagement"
  name        = "02 - Release Wealth Management Module"
  description = "Release the new Wealth Management components"

  variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 1
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "release"
  ]
}

resource "launchdarkly_feature_flag" "aiPromptText" {
  project_key = var.project_key
  key         = "aiPromptText"
  name        = "03 - Adjust Prompts for Wealth Insights"
  description = "Tune and release new prompts for the AWS Bedrock powered Wealth Insights API"

  variation_type = "string"
  variations {
    value = "Playing the role of a financial analyst, using the data contained within the information set at the end of this prompt, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor. Hard constraint on a maximum of 50 words. Financial data is next - "
    name  = "Baseline"
  }
  variations {
    value = "Playing the role of a financial analyst specializing in maximizing financial savings, using the data contained within the information set at the end of this prompt, write me 50 words focused on how I could adjust spending to improve my financial situation. Provide 2 areas I should reduce spending to improve my financial situation. Your response should be tuned to talking directly to the requestor. Hard constraint on a maximum of 50 words. Financial data is next - "
    name  = "Aggresive Savings"
  }
  variations {
    value = "Throw caution to the wind. Play the role of a financially irresponsible individual, who is looking to party in vegas for a weekend without regrets. Using the data contained within the information set at the end of this prompt, write me 50 words focused on how I could build hype in my life at Vegas this year. Provide 2 safe-for-work suggestions for me to spend additional money on to amplify my lifestyle. Your response should be tuned to talking directly to the requestor. Financial data is next - "
    name  = "Chaos Savings"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "release"
  ]
}

resource "launchdarkly_feature_flag" "launchClubLoyalty" {
  project_key = var.project_key
  key         = "launchClubLoyalty"
  name        = "05 - Enable Launch Club Loyalty Program"
  description = "Enable Launch Club Loyalty Program on ToggleAirlines"

   variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "target"
  ]
}

resource "launchdarkly_feature_flag" "priorityBoarding" {
  project_key = var.project_key
  key         = "priorityBoarding"
  name        = "06 - Launch Club - Priority Boarding"
  description = "Enable Launch Club Priority Program on ToggleAirlines"

   variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "target"
  ]
}

resource "launchdarkly_feature_flag" "mealPromoExperience" {
  project_key = var.project_key
  key         = "mealPromoExperience"
  name        = "07 - Targeted Plane Meal Promotion"
  description = "Rolling our meal service on our A380 aircraft - free promotion for testing"

   variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "target"
  ]
}

resource "launchdarkly_feature_flag" "aiTravelInsights" {
  project_key = var.project_key
  key         = "aiTravelInsights"
  name        = "08 - Release AI Travel Insights"
  description = "Amazon Bedrock Powered Travel Insights"

   variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "target"
  ]
}

resource "launchdarkly_feature_flag" "storeHeaders" {
  project_key = var.project_key
  key         = "storeHeaders"
  name        = "09 - Featured Store Headers"
  description = "Headers to drive engagement on specific stores"

   variation_type = "boolean"
  variations {
    value = "true"
    name  = "Available"
  }
  variations {
    value = "false"
    name  = "Unavailable"
  }

  defaults {
    on_variation  = 0
    off_variation = 1
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "experiment"
  ]
}

resource "launchdarkly_feature_flag" "storeAttentionCallout" {
  project_key = var.project_key
  key         = "storeAttentionCallout"
  name        = "10 - Store Highlight Text"
  description = "Header Text for Marketplace Stores"

  variation_type = "string"
  variations {
    value = "New Items"
    name  = "Control"
  }
  variations {
    value = "Sale"
    name  = "Sale"
  }
  variations {
    value = "Final Hours!"
    name  = "Final Hours"
  }

  defaults {
    on_variation  = 0
    off_variation = 0
  }

  client_side_availability {
    using_environment_id = true
  }

  tags = [
    "experiment"
  ]
}