from bs4 import BeautifulSoup
import urllib2

def findCourses(entry):
    courses = []
    fetched = urllib2.urlopen(entry).read()
    soup = BeautifulSoup(fetched, "html.parser")
    links = __getPageLinks(soup)

    if len(links) == 0:
        links = [entry,]
        
    for link in links:
        courses += __scrapePage(link)
    return courses

def __getPageLinks(soup):
    tags = soup.find_all("a", class_="vrtx-page-number")
    links = []
    for tag in tags:
        links.append(tag["href"])
    return links

def __scrapePage(url):
    courses = []
    fetched = urllib2.urlopen(url).read()
    soup = BeautifulSoup(fetched, "html.parser")
    courseContainers = soup.find_all("td", class_="vrtx-course-description-name")
    for container in courseContainers:
        course = {}
        courseTag = container.find("a")
        course["title"] = courseTag.string
        course["href"] = courseTag['href']
        courses.append(course)
    return courses
