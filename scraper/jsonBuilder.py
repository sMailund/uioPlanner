# -*- coding: UTF-8 -*-
import courseFetcher
import json

testurl = "http://www.uio.no/studier/emner/matnat/ifi/INF1050/v17/timeplan/index.html?action=course-schedule"

def createCourseJSON(url, courseTitle):
    output = {}
    activityJSON = courseFetcher.fetch(url) #fetch the webpage

    #check for pages without a schedule
    if len(activityJSON) == 0:
        raise Exception("Empty json")

    #get course name and id
    splitted = courseTitle.split(" - ")
    output["course_id"] = splitted[0]
    output["course_name"] = splitted[1]

    #create placeholders for activities
    output["activities"] = {}
    activities = output["activities"]
    activities["Fellesundervisning"] = []
    activities["Gruppeundervisning"] = []

    #extract activities from json
    for activity in activityJSON:
        new = __createActivityJSON(activityJSON[activity])
        #because python can't handle æøå, jfc
        if (new["type"] == "FOR" or new["type"].endswith("V-F")):
            activities["Fellesundervisning"].append(new)
        else:
            activities["Gruppeundervisning"].append(new)

    return output

def __createActivityJSON(activity):

    output = {}
    output["type"] = activity["teachingMethod"]
    output["title"] = __getActivityTitle(activity)
    output["sessions"] = __getSessions(activity)
    return output

#get the name of the course, which is buried in each entry of "sessions"
def __getActivityTitle(dict):
    firstSession = dict["sessions"][0] #get the first session
    return firstSession["title"] #return the name

#get every session from a given activity
def __getSessions(activity):
    collector = []
    for session in activity["sessions"]:
        newSession = {}
        newSession["startISO"] = session["dtStart"]
        newSession["endISO"] = session["dtEnd"]
        collector.append(newSession)
    return collector
