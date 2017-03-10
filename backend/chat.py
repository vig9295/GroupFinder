from datetime import datetime
import psycopg2
import uuid
import random
import urlparse
import string
import random

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


#TODO
#     update meetings with chatID
#     evertime create meeting - chatID is created

#-----------
#FUNCTIONS
#   for
#  CHAT
#-----------

def create_chat(chatID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO chats (chatID) VALUES " + 
                "(%s)", 
                (chatID,))
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
                    'message': 'chat created successfully'
                }
            )

def create_message(messageID, chatID, senderID, content, utc):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO messages (messageID, chatID, senderID, content, utc) VALUES " + "(%s, %s, %s, %s, %s)",(messageID, chatID, senderID, content, utc))
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
                    'message': 'message created successfully'
                }
            )

def get_messages(chatID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT messageID, senderID, content, utc FROM messages WHERE chatID = %s ORDER BY messageID desc LIMIT 30", (chatID, ))
            details = cur.fetchall()
            stuff = []
            m = 0
            for item in details:
                if m < 30:
                    stuff.append({
                        'messageID' : item[0],
                        'senderID' : item[1],
                        'content': item[2],
                        'utc': item[3],
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

print create_chat("hii")
print create_message('1213', 'hii', 'mil', 'test', '1:00')
print create_message('11', 'hii', 'mil', 'test', '1:00')
print create_message('113', 'hii', 'mil', 'test', '1:00')
print get_messages('hii')



