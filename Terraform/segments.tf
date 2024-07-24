resource "launchdarkly_segment" "beta-users" {
  key         = "beta-users"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "Beta Users"
  description = "Users who have signed up for Beta access to the application"
  tags        = ["beta"]

  rules {
    clauses {
      attribute    = "role"
      op           = "in"
      values       = ["Beta"]
      context_kind = "user"
    }
  }
}

resource "launchdarkly_segment" "dev-team" {
  key         = "dev-team"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "Dev Team"
  description = "Members of the internal development team"
  tags        = ["dev"]

  rules {
    clauses {
      attribute    = "role"
      op           = "in"
      values       = ["Developer"]
      context_kind = "user"
    }
  }
}

resource "launchdarkly_segment" "location-country" {
  key         = "location-country"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "Location - Country"
  description = "Location to target Users"
  tags        = ["location"]

  rules {
    clauses {
      attribute    = "timeZone"
      op           = "in"
      values       = ["America/Los_Angeles"]
      context_kind = "location"
    }
  }
}

resource "launchdarkly_segment" "launch-club-platinum" {
  key         = "launch-club-platinum"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "Launch Club - Platinum"
  description = "Exclusive targeting for Platinum Launch Club users"
  tags        = ["launchClubLoyalty"]

  rules {
    clauses {
      attribute    = "launchclub"
      op           = "in"
      values       = ["platinum"]
      context_kind = "user"
    }
  }
}

resource "launchdarkly_segment" "airline-a-390-passengers" {
  key         = "airline-a-390-passengers"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "A330 Passengers"
  description = "Any user who is flying on an A330 Airplane"
  tags        = ["A330-passengers"]

  rules {
    clauses {
      attribute    = "airplane"
      op           = "in"
      values       = ["a330"]
      context_kind = "experience"
    }
  }
}

resource "launchdarkly_segment" "launch-club-entitlement" {
  key         = "launch-club-entitlement"
  project_key = var.project_key
  env_key     = var.ld_env_key
  name        = "Launch Club Entitlement"
  description = "Launch Club Users - Standard or Platinum"
  tags        = ["launchClubMembers"]

  rules {
    clauses {
      attribute    = "launchclub"
      op           = "in"
      values       = ["platinum", "standard"]
      context_kind = "user"
    }
  }
}
