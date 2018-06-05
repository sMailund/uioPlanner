# -*- coding: UTF-8 -*-
import courseFetcher
import json
import urllib2
from bs4 import BeautifulSoup

#module to create a dict for each course. since the information is spread between
#two pages, both pages are scraped and the data is merged together

#TODO: refactor convoluted code
def createCourseJSON(url, courseTitle):
    output = {}
    activityJSON = courseFetcher.fetch(url) #fetch the webpage

    #check for pages without a schedule
    if len(activityJSON) == 0:
        raise Exception("Empty json")

    #get course name and id
    splitted = courseTitle.split(u' \u2013 ')
    output["course_id"] = splitted[0]
    output["course_name"] = splitted[1]

    #create placeholders for activities
    output["activities"] = __getSceleton(url.split("?")[0])
    activities = output["activities"]

    #extract activities from json
    for activity in activityJSON:
        new = __createActivityJSON(activityJSON[activity])
        for context in output["activities"]:
            for item in output["activities"][context]:
                if activity == item["tag"]:
                    item["sessions"] = new["sessions"]

    return output

#get a sceleton json with correct activity titles and correct order and sorting
def __getSceleton(url):
    fetched = urllib2.urlopen(url).read()
    soup = BeautifulSoup(fetched, "html.parser")

    sceleton = {}
    sceleton["Fellesundervisning"] = __findActivities(soup, "Fellesundervisning", "Plenary sessions")
    sceleton["Gruppeundervisning"] = __findActivities(soup, "Gruppeundervisning", "Group sessions")
    return sceleton


def __findActivities(soup, searchText, searchTextEng):
    #try catch in case there are none of the specified activities
    tag = "h2"
    className = "cs-toc-title"
    target = soup.find(tag, class_=className, text=searchText) #search norwegian
    if target is None: #if none where found, search in english
        target = soup.find(tag, class_=className, text=searchTextEng)

    try:
            activities = target.findNext("div") \
            .find_all("a", class_="cs-toc-section-link")
    except:
        return [] #return empty array if there are none

    results = []
    for activity in activities:
        tag = activity["href"].split("#")[1]
        result = {}
        result["tag"] = tag
        #clean up title
        #a total mess, but it works
        textcontent = activity.get_text().split(" - ")
        if len(textcontent) == 1:
            result["title"] = textcontent[0].split("\n")[0].strip()
        else:
            result["title"] = textcontent[0].split("\n")[0].strip() + " - " \
                + textcontent[1].split("\n")[0].strip()
        results.append(result)
    return results

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
        newSession["title"] = session["title"]
        collector.append(newSession)
    return collector

#print json.dumps(createCourseJSON("http://www.uio.no/studier/emner/hf/ifikk/EXPHIL03E/h17/timeplan/index.html?action=course-schedule", "inf1010 - inf1010"), indent=4)
