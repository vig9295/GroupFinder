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

def upload_document(documentID, meetingID, name, path):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO documents (documentID, meetingID, name, path) VALUES (%s, %s, %s, %s)", (documentID, meetingID, name, path))
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
                    'message': 'Document created successfully'
                }
            )

def get_documents(meetingID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("SELECT documentID, meetingID, name, path FROM documents WHERE meetingID = %s", (meetingID, ))
            details = cur.fetchall()
            stuff = []
            for item in details:
                stuff.append({
                    'documentID' : item[0],
                    'meetingID' : item[1],
                    'name': item[2],
                    'path': item[3]
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



#Don't think this is necessary
# def get_document_url(documentID):
#     db = connect()
#
#     with db.cursor() as cur:
#         try:
#             cur.execute("SELECT documentID, meetingID, name FROM documents WHERE documentID = %s", (documentID,))
#             details = cur.fetchall()
#             if len(details) == 1:
#                 temp = details[0]
#                 stuff = {
#                     'documentID' : temp[0],
#                     'meetingID' : temp[1],
#                     'name': temp[2],
#                     'path': temp[3]
#                 }
#                 return (
#                     {
#                         'success': True,
#                         'message': 'Query successful',
#                         'data' : stuff
#                     }
#                 )
#             else:
#                 return (
#                     {
#                         'success': False,
#                         'message': 'Given document doesn\'t exist'
#                     }
#                 )
#         except psycopg2.DatabaseError as db_error:
#             db.rollback()
#             print str(db_error)
#             return (
#                 {
#                     'success': False,
#                     'message': 'DB error'
#                 }
#             )
