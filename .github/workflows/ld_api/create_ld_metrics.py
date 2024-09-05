import os
from venv import create
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
import sys

BASE_URL = "https://app.launchdarkly.com/api/v2"


def main():
    
    if len(sys.argv) > 1:
        ld_env_key = sys.argv[1]
        
        createMetricsForLDProject(ld_env_key)
    
def createMetricsForLDProject(ld_api_key):
    
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"
    createMetricURL = "/metrics/" + project_key
    
    print('Creating Metrics for LaunchDarkly Project: ' +  project_key)
    
    createStoreAccessedMetric(ld_api_key, createMetricURL)
    createItemAddedMetrics(ld_api_key, createMetricURL)
    createCartAccessedMetric(ld_api_key, createMetricURL)
    createCustomerCheckoutMetric(ld_api_key, createMetricURL)
    createStockAPILatencyMetric(ld_api_key, createMetricURL)
    createStocksAPIErrorRates(ld_api_key, createMetricURL)
    createRecentTradesDBLatencyMetric(ld_api_key, createMetricURL)
    createRecentTradesDBErrorRates(ld_api_key, createMetricURL)
    createInCartUpSellMetric(ld_api_key, createMetricURL)
    createInCartTotalPriceMetric(ld_api_key, createMetricURL)
    createAIChatbotPositiveFeedbackMetric(ld_api_key, createMetricURL)
    createAIChatbotNegativeFeedbackMetric(ld_api_key, createMetricURL)
    createSearchEngineAddToCartMetric(ld_api_key, createMetricURL)
    
def createAIChatbotNegativeFeedbackMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "AI Chatbot Negative Feedback",
        "eventKey": "AI Chatbot Bad Service",
        "Description": "This metric will track negative feedback given to AI Model used in chatbot for the bad responses provided.",
        "isNumeric": False,
        "key": "ai-chatbot-bad-service",
        "kind": "custom",
        "successCriteria": "LowerThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["experiment"]
    }
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    if response.status_code == 201:
        print("Metric 'AI Chatbot Negative Feedback' created successfully.")
        
def createAIChatbotPositiveFeedbackMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "AI Chatbot Positive Feedback",
        "eventKey": "AI chatbot good service",
        "Description": "This metric will track positive feedback given to AI Model used in chatbot for the good responses provided.",
        "isNumeric": False,
        "key": "ai-chatbot-good-service",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["experiment"]
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'AI Chatbot Positive Feedback' created successfully.")

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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
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
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Stocks API Error Rate' created successfully.")
        
def createRecentTradesDBLatencyMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Recent Trades DB Latency",
        "eventKey": "recent-trades-db-latency",
        "Description": "Recent Trades DB Latency",
        "isNumeric": True,
        "key": "recent-trades-db-latency",
        "kind": "custom",
        "successCriteria": "LowerThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["remediate", "investment", "trades", "db", "latency"],
        "unit": "ms"
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Recent Trades DB Latency' created successfully.")
    
def createRecentTradesDBErrorRates(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Recent Trades DB Errors",
        "eventKey": "recent-trades-db-errors",
        "Description": "Recent Trades DB Errors",
        "isNumeric": False,
        "key": "recent-trades-db-errors",
        "kind": "custom",
        "successCriteria": "LowerThanBaseline",
        "randomizationUnits": ["audience"],
        "tags": ["remediate", "investment", "trades", "db", "error", "rates"]
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Recent Trades DB Error Rates' created successfully.")
        
def createInCartUpSellMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "In-Cart Up-Sell",
        "eventKey": "upsell-tracking",
        "Description": "Up-Sell Opportunities in Cart",
        "isNumeric": False,
        "key": "upsell-tracking",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["audience", "user"],
        "tags": ["experiment"]
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'In-Cart Up-Sell' created successfully.")

def createSearchEngineAddToCartMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "Search Engine Add to Cart",
        "eventKey": "search-engine-add-to-cart",
        "Description": "Track to see if Add to Cart button in Search Engine",
        "isNumeric": False,
        "key": "search-engine-add-to-cart",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["audience", "user"],
        "tags": ["experiment"]
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'Search Engine Add to Cart' created successfully.")
        
def createInCartTotalPriceMetric(ld_api_key, createMetricURL):
    
    metricPayload = {
        "name": "In-Cart Total Price",
        "eventKey": "in-cart-total-price",
        "Description": "Total Price of Items in Cart",
        "isNumeric": True,
        "key": "in-cart-total-price",
        "unit": "$",
        "kind": "custom",
        "successCriteria": "HigherThanBaseline",
        "randomizationUnits": ["audience", "user"],
        "tags": ["experiment"]
    }
    
    response = requests.request("POST", BASE_URL + createMetricURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(metricPayload))
    
    if response.status_code == 201:
        print("Metric 'In-Cart Total Price' created successfully.")


if __name__ == "__main__":
    main()