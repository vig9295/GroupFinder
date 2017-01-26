from datetime import datetime
import psycopg2

import uuid
import random

import urlparse
import psycopg2


#Things to be done
#Login Use Case:
# 1. Be able to create an account with a username and a password.
# 2. Check if the username and the password sync for those things.

#Use case of the GT Sync Stuff.
# For each student be able to add certain classes;
# What that would mean is that the there will be a student id
# and a list of classes, and for each class, create a class if
# not there, and add the student regardless.

#Add the other class use case.

#Having an organized list of OTHER classes for the student to choose from.

#Having a list of classes that the user is affiliated with
# --> Pull up the information required to put something on those list of classes.


#----------------
#Create a class


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
            cur.execute("INSERT INTO meeting_members (meetingID, memberID) VALUES " +
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
            cur.execute("INSERT INTO class_members (classID, memberID) VALUES " +
                                                "(%s, %s)",
                                            (classID, memberID))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
        else:
            db.commit()


x = input("Enter the command")
#Commands to be run for the demo
#Diego is the first student to enroll for classes, we add all classes that are not there
# and enroll Diego in those classes
if x == 1:
    add_member(3, "Diego", "CM", 3, "Center Street", "Morning Person")
    add_class(10, "CS 4510", "Prof. John")
    add_class(20, "CS 3311", "Prof. Smith")
    add_class(30, "CX 4000", "Dr. Heisenberg")
    add_class_member(10, 3)
    add_class_member(20, 3)
    add_class_member(30, 3)

#Uddhav joins next and he enrolls for the first class
if x == 2:
    add_member(1, "Uddhav", "IE", 4, "North Ave", "Evening Person")
    add_class_member(10, 1)

#Similarly for John
if x == 3:
    add_member(2, "John", "CS", 3, "North Ave", "Morning Person")
    add_class_member(10, 2)
    add_class_member(20, 2)

#Uddhav creates a meeeting for CS 4510 and invites all the members to the meeting
if x == 4:
    add_meeting(100, 10, "CS 4510 HW1 Discussion", "CULC", "Please be on time", 1)
    add_meeting_member(100, 1)
    add_meeting_member(100, 2)
    add_meeting_member(100, 3)

#John creates this meeting, and only John and Uddhav are invited
if x == 5:
    add_meeting(101, 10, "CS 4510 HW2 Discussion", "North Ave", "Quick Revision", 2)
    add_meeting_member(101, 2)
    add_meeting_member(101, 1)
