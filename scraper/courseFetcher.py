import urllib2
import json

#fetching the JSON does not work without headers, 
#and will return the regular page if headers are missing
requestHeaders = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "X-Requested-With": "XMLHttpRequest"
}

#takes a url to a json-source and returns a dictionary of the json
def fetch(url):
    request = __createRequest(url)
    response = urllib2.urlopen(request)
    return json.loads(response.read())

def __createRequest(url):
    request = urllib2.Request(url)
    request = __addRequestHeaders(request)
    return request

def __addRequestHeaders(request):
    for key, value in requestHeaders.items():
        request.add_header(key, value)
    return request

#test url
#http://www.uio.no/studier/emner/matnat/ifi/INF1510/v17/timeplan/index.html?action=course-schedule
