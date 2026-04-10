from enum import Enum


class PublicGraphError(str, Enum):
    BillingQuotaExceeded = "BillingQuotaExceeded"
