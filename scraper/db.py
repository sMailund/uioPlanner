from time import strftime, gmtime
import psycopg2
from psycopg2 import sql
import utf
from connect import getConnection

def init():
    connection = getConnection()
    cur = connection.cursor()

    cur.execute("CREATE TABLE scraping (\
        course_id text NOT NULL, \
        course_name text NOT NULL, \
        activities text NOT NULL)"
        )

    connection.commit()
    cur.close()
    connection.close()

def insert(json, courseId, courseName):
    print("inserting {0}".format(utf.norwegify(courseName)))
    json = utf.norwegify(json)
    connection = getConnection()
    cur = connection.cursor()

    cur.execute("INSERT INTO scraping (activities, course_id, course_name) \
        VALUES (%s, %s, %s)", (json, courseId, courseName))

    connection.commit()
    cur.close()
    connection.close()

def finish():
    connection = getConnection()
    cur = connection.cursor()
    cur.execute("DELETE FROM courses")
    cur.execute("INSERT INTO courses SELECT * FROM scraping")
    cur.execute("DROP TABLE scraping")

    connection.commit()
    cur.close()
    connection.close()

def reset():
    connection = getConnection()
    cur = connection.cursor()

    cur.execute("DROP TABLE scraping")

    connection.commit()
    cur.close()
    connection.close()
