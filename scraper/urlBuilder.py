
baseurl = "http://www.uio.no"
allCoursesPath = "/timeplan/index.html?action=course-schedule"

def buildURL(href, semester):
    path = href.split("/index.html")[0]
    return baseurl \
        + path \
        + ("/%s" % semester) \
        +  allCoursesPath
