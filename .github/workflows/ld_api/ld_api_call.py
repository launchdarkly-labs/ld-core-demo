## This file is to call all LD API functions with API rate check implemented to avoid any rate limit issues
import re
import time
import requests
from requests.exceptions import HTTPError
import os
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time


BASE_URL = "https://app.launchdarkly.com/api/v2"
CALL_THRESHOLD = 1


class RateLimitError(Exception):
    '''Exception used by the main function when the rate limit is too low'''
    pass


def timeToNextReset(nextReset):
    '''
    Compares current time to the rate limit reset time. Then sees how many whole seconds left until the reset, and returns that number
    '''
    currentMilliTime = round(time.time() * 1000)
    if nextReset - currentMilliTime > 0:
        return round((nextReset - currentMilliTime) // 1000)
    else:
        return 0

def checkRateLimit(method, url, apikey, body):

    defaultTries = 5
    tries = defaultTries
    delay = 5

    def getResetTime():
        resetTime = int(response.headers['X-Ratelimit-Reset'])

        nonlocal delay
        delay = timeToNextReset(resetTime)
        if delay < 1:
            delay = .5

        nonlocal tries
        tries -= 1

        print('Rate limit is too low. It is currently ' + str(rateLimitRemaining) + '. Retrying in ' + str(delay) + ' seconds.')
        time.sleep(delay)

    while tries > 0:

        try:
            response = requests.request(method, BASE_URL + url, headers = {'Authorization': apikey, 'Content-Type': 'application/json'}, data = body)
            rateLimitRemaining = response.headers['X-Ratelimit-Route-Remaining']

        except HTTPError as http_err:
            print('An HTTP error occurred: ' + str(http_err))
            break
        except Exception as err:
            print('An error occurred: ' + str(err))
            break


        if int(rateLimitRemaining) <= CALL_THRESHOLD:
            getResetTime()
            if tries == 0:
                raise RateLimitError
        else:
            tries = defaultTries
            return response

