from datetime import datetime
import psycopg2
import uuid
import random
import urlparse

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse("postgres://ehbxolgrxnzbxg:Q_wWyMAWJl2iEFGFaXmK7GyUxG@ec2-54-235-102-235.compute-1.amazonaws.com:5432/d99uk4hl0qtt4l")

#This function will be used to connect to the db using a token
def connect():
    conn = psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port)
    return conn


#-----------
#FUNCTIONS
#   for
#  CLASSES
#-----------



#Leader can be the professor, or the leader of the group
def add_class(classID, name, leader, typ):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO classes (classID, name, leader, type) VALUES " +
                                                "(%s, %s, %s, %s)",
                                            (classID, name, leader, typ))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to create the db entry'
                }
            )
        else:
            db.commit()
            return (
                {
                    'success': True,
                    'message': 'Class created successfully'
                }
            )

#Adds a member to the classes
def add_class_member(classID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO class_members (classID, memberID) VALUES " +
                                                "(%s, %s)",
                                            (classID, memberID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to create the db entry'
                }
            )
        else:
            db.commit()
            return (
                {
                    'success': True,
                    'message': 'Member successfully added to class'
                }
            )

#returns the details of the as a list [classID, name, leader, type]
def get_class_details(classID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, name, leader FROM classes WHERE classID = %s", (classID,))
            details = cur.fetchall()
            if len(details) == 1:
                temp = details[0]
                stuff = {
                    'classID' : str(temp[0]),
                    'name' : str(temp[1]),
                    'leader': str(temp[2])
                }
                return (
                    {
                        'success': True,
                        'message': 'query successful',
                        'data' : stuff
                    }
                )
            else:
                return (
                    {
                        'success': False,
                        'message': 'Given class does not exist'
                    }
                )
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'DB error'
                }
            )

#Finds a class based on the student
#[(classID, name, professor)]
def find_classes(memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, name, leader FROM classes WHERE classID in (SELECT classID FROM class_members WHERE memberID= %s)", (memberID,))
            details = cur.fetchall()
            stuff = []
            for item in details:
                stuff.append({
                    'classID' : item[0],
                    'name' : item[1],
                    'leader': item[2]
                })
            return (
                {
                    'success': True,
                    'message': 'successful',
                    'data' : stuff
                }
            )
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'DB error'
                }
            )

def get_class_members(classID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT memberID, name, major FROM members WHERE memberID in (SELECT memberID FROM class_members WHERE classID= %s)", (classID,))
            details = cur.fetchall()
            stuff = []
            for item in details:
                stuff.append({
                    'memberID' : item[0],
                    'name' : item[1],
                    'major': item[2]
                })
            return (
                {
                    'success': True,
                    'message': 'successful',
                    'data' : stuff
                }
            )
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'DB error'
                }
            )

def get_class_meetings(classID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, title, location, description, starttime, meetingID FROM meetings WHERE meetingID in (SELECT meetingID FROM meetings WHERE classID= %s)", (classID,))
            details = cur.fetchall()
            stuff = []
            for item in details:
                # date, time = item[4].split(' ')
                # year, month, day = date.split('-')
                # hour, minute = time.split(':')
                stuff.append({
                    'classID' : item[0],
                    'title' : item[1],
                    'location' : item[2],
                    'description' : item[3],
                    'dateJson': item[4], 
                    'meetingID': item[5],
                })
            
            return (
                {
                    'success': True,
                    'message': 'successful',
                    'data' : stuff
                }
            )
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'DB error'
                }
            )