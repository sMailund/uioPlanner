import urllib2
import json

fetched = urllib2.urlopen('http://www.uio.no/studier/emner/matnat/ifi/INF1510/v17/timeplan/index.html?action=course-schedule').read()
#toJSON = json.loads(fetched)

obj = open('raw1510.py', 'wb')
obj.write(fetched)
obj.close
