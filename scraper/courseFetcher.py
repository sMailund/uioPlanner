import urllib2
import json

#takes a url to a json-source and returns a dictionary of the json
def fetch(url):
    fetched = urllib2 \
        .urlopen(url) \
        .read()
    return json.loads(fetched)

#test url
#http://www.uio.no/studier/emner/matnat/ifi/INF1510/v17/timeplan/index.html?action=course-schedule
