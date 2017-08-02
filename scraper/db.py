import psycopg2
import utf
from connect import getConnection

def insert(json, courseId, courseName):
    print("inserting {0}".format(utf.norwegify(courseName)))
    json = utf.norwegify(json)
    connection = getConnection()
    cur = connection.cursor()

    cur.execute("INSERT INTO python (activities, course_id, course_name) \
        VALUES (%s, %s, %s)", (json, courseId, courseName))
        
    connection.commit()
    cur.close()
    connection.close()
