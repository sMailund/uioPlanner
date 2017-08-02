# -*- coding: UTF-8 -*-

import courseFinder
import jsonBuilder
import urlBuilder
import db
import json
import time

entry = "http://www.uio.no/studier/emner/matnat/ifi/?filter.semester=h17"
semester = "h17"
delay = 1

def scrape():
    errorFile = open('errors.txt', 'wb')
    courses = courseFinder.findCourses(entry)
    print "found %d courses" % len(courses)

    for course in courses:
        activitiesJSON = ""
        try:
            jsonDict = __scrapeCourse(course)
            courseJSON = __formatJSON(jsonDict["activities"])
        except Exception:
            print("could not scrape %s" % course["href"])
            errorFile.write(json.dumps(course) + "\n")
            continue

        db.insert(courseJSON, \
            jsonDict["course_id"],  \
            jsonDict["course_name"])
        time.sleep(delay)

    errorFile.close

def __scrapeCourse(course):
    url = urlBuilder.buildURL(course["href"], semester)
    return jsonBuilder.createCourseJSON(url, course["title"])

def __formatJSON(dict):
    JSON = json.dumps(dict) #turn dict to json-string
    return u''.join(JSON).encode("utf-8").strip() #ಠ_ಠ encode to utf-8 ಠ_ಠ

scrape()
