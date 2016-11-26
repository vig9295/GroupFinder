from datetime import datetime
import psycopg2

import uuid
import random

import urlparse
import psycopg2

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

#This function adds a meeting to list of meetings
def add_meeting(meetingID, classID, name, location, details, organizerID):
    db = connect()

    stime = datetime.now()
    etime = datetime.now()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO meetings (meetingID, classID, name, stime, etime, location, details, organizerID) VALUES " +
                                                "(%s, %s, %s, %s, %s, %s, %s, %s)",
                                            (meetingID, classID, name, stime, etime, location, details, organizerID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()


def add_class(classID, name, prof):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO classes (classID, name, prof) VALUES " +
                                                "(%s, %s, %s)",
                                            (classID, name, prof))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()

def add_member(memberID, name, major, year, location, info):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO members (memberID, name, major, year, location, info, sumratings, numratings) VALUES " +
                                                "(%s, %s, %s, %s, %s, %s, 0, 0)",
                                            (memberID, name, major, year, location, info))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()

def add_meeting_member(meetingID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO classes (meetingID, memberID) VALUES " +
                                                "(%s, %s)",
                                            (meetingID, memberID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()

def add_class_member(classID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO classes (classID, memberID) VALUES " +
                                                "(%s, %s)",
                                            (classID, memberID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()

#Commands to be run for the demo
add_member(1, "Uddhav", "IE", 4, "North Ave", "Evening Person")
add_member(2, "John", "CS", 3, "North Ave", "Morning Person")
add_member(3, "Diego", "CM", 3, "Center Street", "Morning Person")

add_class(10, "CS 4510", "Prof. John")
add_class(20, "CS 3311", "Prof. Smith")
add_class(30, "CX 4000", "Dr. Heisenberg")

add_class_member(10, 1)
add_class_member(10, 2)
add_class_member(10, 3)
add_class_member(20, 2)
add_class_member(20, 3)
add_class_member(30, 3)

add_meeting(100, 10, "CS 4510 HW1 Discussion", "CULC", "Please be on time", 1)
add_meeting_member(100, 1)
add_meeting_member(100, 2)
add_meeting_member(100, 3)

add_meeting(101, 10, "CS 4510 HW2 Discussion", "North Ave", "Quick Revision", 2)
add_meeting_member(101, 2)
add_meeting_member(101, 1)
