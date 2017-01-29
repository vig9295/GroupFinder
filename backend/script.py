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

#--------------------
#Helper SQL Functions
#--------------------

#Adds a member to the ID, this will contain the memberID, details and the password
#Rating System not to be implemented, because it was suggested not to in the user
#feedback
def add_member(memberID, name, password):
    add_member(memberID, name, 'ME', '4', 'South Ave', 'test', password)

def add_member(memberID, name, major, year, location, info, password):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO members (memberID, name, major, year, location, info, password) VALUES " +
                                                "(%s, %s, %s, %s, %s, %s, %s)",
                                            (memberID, name, major, year, location, info, password))
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
                    'message': 'Member created successfully'
                }
            )

#checks if the username corresponds with a password
#returns true if they do otherwise it returns false.
def check_member(username, password):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT password FROM members WHERE memberID = %s", (username, ))
            details = cur.fetchall()
            if (len(details) == 1):

                if (details[0][0] == password):
                    print "LOGGED IN"
                    return (
                        {
                            'success': True,
                            'message': 'Logged in successfully'
                        }
                    )
                else:
                    print "GG"
                    return (
                        {
                            'success': False,
                            'message': 'Password incorrect'
                        }
                    )
            else:
                print "FUCK"
                return (
                    {
                        'success': False,
                        'message': 'Username does not exist'
                    }
                )
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Database error'
                }
            )


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

#returns the details for all other type classes.
# def get_all_other_classes():
#     db = connect()
#
#     with db.cursor() as cur:
#         try:
#             cur.execute("SELECT classID FROM classes WHERE type = 'others'")
#             content = cur.fetchall()
#             return (
#                 {
#                     'success': False,
#                     'message': content
#                 }
#             )
#         except psycopg2.DatabaseError as db_error:
#             db.rollback()
#             print str(db_error)
#             return (
#                 {
#                     'success': False,
#                     'message': 'Unable to get the required information'
#                 }
#             )
#     #TODO

#returns the details of the as a list [classID, name, leader, type]
def get_class_details(classID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, name, leader FROM classes WHERE class = %s", classID)
            details = cur.fetchall()
            if len(details) == 1:
                temp = details[0]
                stuff = {
                    'classID' : temp[0],
                    'name' : temp[1],
                    'leader': temp[2]
                }
                return (
                    {
                        'success': True,
                        'message': stuff
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
            cur.execute("SELECT classID, name, leader FROM classes WHERE memberID = %s", memberID)
            details = cur.fetchall()
            for item in details:
            stuff = []
            stuff.append({
                'classID' : item[0],
                'name' : item[1],
                'leader': item[2]
            })
            return (
                {
                    'success': True,
                    'message': stuff
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

#TODO Might have to change if stuff needs to be added as per "other classes"
#Finds a class based on the student
#returns a tuple of two lists
# (GTClassesList, otherClassesList)
# ([classID, name, professor], [classID, name, leader])
# def find_classes(student):
#     pass
