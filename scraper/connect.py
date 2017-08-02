import psycopg2

dbname = "planner"
username = "scraper"
password = "scraper"

def getConnection():
    return psycopg2.connect("dbname={0} user={1} password={2}"\
        .format(dbname, username, password))
