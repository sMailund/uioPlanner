import calendar
import time

baseurl = "http://www.uio.no"
schedulePath = "/timeplan/index.html"
allCoursesPath = schedulePath + "?action=course-schedule"
timeparam = 't'

def buildJsonURL(href, semester):
    path = href.split("/index.html")[0]
    return baseurl \
        + path \
        + ("/%s" % semester) \
        + allCoursesPath \
        + '&' \
        + timeparam \
        + '=' \
        + getEpochTimeNow() #parameter t must be set with current epoch time for json link to work

def getEpochTimeNow():
    return str(calendar.timegm(time.gmtime()))