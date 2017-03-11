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

# def create_chat(chatID, meetingID):
#     db = connect()
#
#     with db.cursor() as cur:
#         try:
#             cur.execute("INSERT INTO chats (chatID) VALUES " +
#                 "(%s, %s)",
#                 (chatID, meetingID,))
#         except psycopg2.DatabaseError as db_error:
#             db.rollback()
#             print str(db_error)
#             return (
#                 {
#                     'success': False,
#                     'message': 'Unable to create the db entry'
#                 }
#             )
#         else:
#             db.commit()
#             return (
#                 {
#                     'success': True,
#                     'message': 'chat created successfully'
#                 }
#             )


def get_chatID(meetingID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT chatID FROM meetings WHERE meetingID = %s ", (meetingID, ))
            details = cur.fetchall()
            return (
                {
                    'success': True,
                    'chatID' : chat[0][0]
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

def get_chatID(memberID, member1ID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT chatID FROM chats WHERE member1 = %s AND member2 = %s", (memberID, member1ID))
            details = cur.fetchall()
            if details:
                return (
                    {
                        'success': True,
                        'chatID' : details[0][0]
                    }
                )
            else:
                chatID = id_generator(32)
                cur.execute("INSERT INTO chats (chatID, member1, member2) VALUES (%s, %s, %s)", (chatID, memberID, member1ID))
                cur.execute("INSERT INTO chats (chatID, member1, member2) VALUES (%s, %s, %s)", (chatID, member1ID, memberID))
                db.commit()
                return (
                    {
                        'success': True,
                        'chatID' : chatID
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

def create_message(chatID, senderID, content, utc):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO messages (chatID, senderID, content, utc) VALUES (%s, %s, %s, %s)", (chatID, senderID, content, utc))
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
            cur.execute("SELECT messageID, senderID, content, utc FROM messages WHERE chatID = %s ORDER BY messageID DESC LIMIT 30", (chatID, ))
            details = cur.fetchall()
            stuff = []
            for item in details:
                stuff.append({
                    '_id' : item[0],
                    'user' : {
                        '_id': item[1],
                        'name': item[1],
                        'avatar': ''
                    },
                    'text': item[2],
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


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

# print create_chat("hii")
# print create_message('1213', 'hii', 'mil', 'test', '1:00')
# print create_message('11', 'hii', 'mil', 'test', '1:00')
# print create_message('113', 'hii', 'mil', 'test', '1:00')
# print get_messages('hii')
