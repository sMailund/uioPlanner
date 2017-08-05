
baseurl = "http://www.uio.no"
schedulePath = "/timeplan/index.html"
allCoursesPath = schedulePath + "?action=course-schedule"

def buildJsonURL(href, semester):
    path = href.split("/index.html")[0]
    return baseurl \
        + path \
        + ("/%s" % semester) \
        + allCoursesPath
