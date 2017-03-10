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
#  MEETINGS
#-----------


def create_meetings(meetingID, classID, title, location, description, dateJson, memberID):
    db = connect()
    #timestr = str(dateJson['year']) + '-' + str(dateJson['month']) + '-' + str(dateJson['day']) + ' ' + str(dateJson['hour']) + ':' + str(dateJson['minute'])
    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO meetings (meetingID, classID, title, location, description, starttime, memberID) VALUES " +
                                                "(%s, %s, %s, %s, %s, %s, %s)",
                                            (meetingID, classID, title, location, description, dateJson, memberID))
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

def edit_meeting_location(meetingID, location):
        db = connect()

        with db.cursor() as cur:
            try:
                cur.execute("UPDATE meetings SET location = %s WHERE meetingID = %s",
                                                (location, meetingID))
            except psycopg2.DatabaseError as db_error:
                db.rollback()
                print str(db_error)
                return (
                    {
                        'success': False,
                        'message': 'Unable to update the db entry'
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

def edit_meeting_title(meetingID, title):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE meetings SET title = %s WHERE meetingID = %s",
                                            (title, meetingID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to update the db entry'
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

def edit_meeting_description(meetingID, description):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE meetings SET description = %s WHERE meetingID = %s",
                                            (description, meetingID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to update the db entry'
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

def edit_meeting_date(meetingID, dateJson):
    db = connect()
    #timestr = str(dateJson['year']) + '-' + str(dateJson['month']) + '-' + str(dateJson['day']) + ' ' + str(dateJson['hour']) + ':' + str(dateJson['minute'])
    with db.cursor() as cur:
        try:
            cur.execute("UPDATE meetings SET starttime = %s WHERE meetingID = %s",
                                            (dateJson, meetingID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to update the db entry'
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

def add_meeting_members(meetingID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO meeting_members (meetingID, memberID) VALUES " +
                                                "(%s, %s)",
                                            (meetingID, memberID))
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

def get_meeting_members(meetingID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT memberID, name, major FROM members WHERE memberID in (SELECT memberID FROM meeting_members WHERE meetingID= %s)", (meetingID,))
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

def get_class_meetings_partof(classID, memberID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, title, location, description, starttime, meetingID FROM meetings where meetingID in (SELECT meetingID from meeting_members WHERE meetingID in (SELECT meetingID from meetings where classID=%s) and memberID=%s)", (classID, memberID))
            details = cur.fetchall()
            # print details
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
                    'meetingID': item[5]
                })
            return stuff
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return False


def get_class_meetings_all(classID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, title, location, description, starttime, meetingID FROM meetings WHERE meetingID in (SELECT meetingID FROM meetings WHERE classID= %s)", (classID,))
            details = cur.fetchall()
            # print details
            stuff = []
            for item in details:
                stuff.append({
                    'classID' : item[0],
                    'title' : item[1],
                    'location' : item[2],
                    'description' : item[3],
                    'dateJson': item[4],
                    'meetingID': item[5]
                })
            return stuff
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return False

def get_class_meetings(classID, memberID):
    print classID, memberID
    data1 = get_class_meetings_partof(classID, memberID)
    data2 = get_class_meetings_all(classID)

    if (not data1 and type(data1) == bool) or (not data2 and type(data2) == bool):
        return (
            {
                'success': False,
                'message': "Database Error. Please try again later."
            }
        )
    print data1
    print data2
    data3 = []
    meetings_blacklisted = []
    for i in data1:
        meetings_blacklisted.append(i['meetingID'])
    for j in data2:
        if j['meetingID'] not in meetings_blacklisted:
            data3.append(j)

    return (
        {
            'success': True,
            'data1': data1,
            'data2': data3
        }
    )
