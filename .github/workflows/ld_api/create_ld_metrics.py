import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
from ld_api_call import checkRateLimit
import sys

def main():
    
    if len(sys.argv) > 1:
        ld_env_key = sys.argv[1]
        createMetricsForLDProject(ld_env_key)
    
def createMetricsForLDProject(ld_api_key):
    
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"
    createMetricURL = "/metrics/" + project_key
    
    createStoreAccessedMetric(ld_api_key, createMetricURL)
    createItemAddedMetrics(ld_api_key, createMetricURL)
    createCartAccessedMetric(ld_api_key, createMetricURL)
    createCustomerCheckoutMetric(ld_api_key, createMetricURL)
    createStockAPILatencyMetric(ld_api_key, createMetricURL)
    createStocksAPIErrorRates(ld_api_key, createMetricURL)
    
    
def createStoreAccessedMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Store Accessed",
        "eventKey": "store-accessed",
        "Description": "Customer Accessing Marketplace Store",
        "isNumeric": False,
        "key": "store-accessed",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["user", "audience"],
        "tags": ["store", "accessed"]
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Store Accessed' created successfully.")
        
def createItemAddedMetrics(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Item Added to Cart",
        "eventKey": "item-added",
        "Description": "Customer Added Item to Cart",
        "isNumeric": False,
        "key": "item-added",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["user", "audience"],
        "tags": ["cart", "item", "added"]
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Item Added' created successfully.")
    
def createCartAccessedMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Cart Accessed",
        "eventKey": "cart-accessed",
        "Description": "Customer Accessing Shopping Cart",
        "isNumeric": False,
        "key": "cart-accessed",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["user", "audience"],
        "tags": ["cart", "accessed"]
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Cart Accessed' created successfully.")
        
def createCustomerCheckoutMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Customer Checkout",
        "eventKey": "customer-checkout",
        "Description": "Customer Checking Out From Store",
        "isNumeric": False,
        "key": "customer-checkout",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["user", "audience"],
        "tags": ["checkout"]
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Customer Checkout' created successfully.")
        
def createStockAPILatencyMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Stock API Latency",
        "eventKey": "stock-api-latency",
        "Description": "Checking API Latency for Stocks",
        "isNumeric": True,
        "key": "stock-api-latency",
        "kind": "custom",
        "successCriteria": "LowerThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["stock", "api", "latency"],
        "unit": "ms"
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Stock API Latency' created successfully.")
    
def createStocksAPIErrorRates(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Stocks API Error Rates",
        "eventKey": "stocks-api-error-rates",
        "Description": "Error Rates for the Stocks API",
        "isNumeric": False,
        "key": "stocks-api-error-rates",
        "kind": "custom",
        "successCriteria": "LowerThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["release", "stocks", "api", "error", "rates"]
    }
    
    response = checkRateLimit("POST", createMetricURL, ld_api_key, json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Stocks API Error Rate' created successfully.")
        
if __name__ == "__main__":
    main()