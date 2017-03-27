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
#  MEMBERS
#-----------

#Adds a member to the ID, this will contain the memberID, details and the password
#Rating System not to be implemented, because it was suggested not to in the user
#feedback
def add_member(memberID, name, password):
    return add_member_helper(memberID, name, 'ME', '4', 'South Ave', 'test', password)

def add_member_helper(memberID, name, major, year, location, info, password):
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
            cur.execute("SELECT password, is_banned FROM members WHERE memberID = %s", (username, ))
            details = cur.fetchall()
            if (len(details) == 1):
                if (details[0][1]):
                    return (
                        {
                            'success': False,
                            'message': 'User is currently banned'
                        }
                    )
                else:
                    if (details[0][0] == password):
                        return (
                            {
                                'success': True,
                                'message': 'Logged in successfully'
                            }
                        )
                    else:
                        return (
                            {
                                'success': False,
                                'message': 'Password incorrect'
                            }
                        )
            else:
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


#Bans a specific user
def ban_member(memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE members SET is_banned = true WHERE memberID = %s", (memberID,))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to perform DB Task'
                }
            )
        else:
            db.commit()
            return (
                {
                    'success': True,
                    'message': 'Banned successfully'
                }
            )


#Unbans a specific user
def unban_member(memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE members SET is_banned = false WHERE memberID = %s", (memberID,))
        except psycopg2.DatabaseError as db_error:
            db.rollback()
            print str(db_error)
            return (
                {
                    'success': False,
                    'message': 'Unable to perform DB Task'
                }
            )
        else:
            db.commit()
            return (
                {
                    'success': True,
                    'message': 'Unbanned successfully'
                }
            )
