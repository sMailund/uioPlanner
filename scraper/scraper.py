# -*- coding: UTF-8 -*-

import courseFinder
import jsonBuilder
import urlBuilder
import db
import json
import time

semester = "v18"
entry = "http://www.uio.no/studier/emner/alle/?filter.semester=" + semester
delay = 1

def scrape():
    db.init()
    courses = courseFinder.findCourses(entry)
    print "found %d courses" % len(courses)

    for course in courses:
        activitiesJSON = ""
        try:
            jsonDict = __scrapeCourse(course)
            courseJSON = __formatJSON(jsonDict["activities"])
        except Exception as error:
            print("could not scrape %s" % course["href"])
            print error
            continue

        db.insert(courseJSON, \
            jsonDict["course_id"],  \
            jsonDict["course_name"])
        time.sleep(delay)

    db.finish()

def __scrapeCourse(course):
    url = urlBuilder.buildJsonURL(course["href"], semester)
    return jsonBuilder.createCourseJSON(url, course["title"])

def __formatJSON(dict):
    JSON = json.dumps(dict) #turn dict to json-string
    return u''.join(JSON).encode("utf-8").strip() #ಠ_ಠ encode to utf-8 ಠ_ಠ

scrape()
