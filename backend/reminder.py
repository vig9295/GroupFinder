import psycopg2
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


def send_reminders(meetingID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE meeting_members SET to_remind = true WHERE meetingID = %s", (meetingID,))
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
                    'message': 'Reminder values updated'
                }
            )

def acknowledge_reminder(memberID, meetingID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("UPDATE meeting_members SET to_remind = false WHERE meetingID = %s AND memberID = %s", (meetingID, memberID))
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
                    'message': 'Reminder values updated'
                }
            )

def receive_reminders(memberID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT classID, title, location, starttime, description, meetingID FROM meetings WHERE meetingID in (SELECT meetingID FROM meeting_members WHERE memberID= %s AND to_remind = true)", (memberID,))
            details = cur.fetchall()
            stuff = []
            for item in details:
                cur.execute("SELECT name from classes WHERE classID = %s", (item[0], ))
                class_name = cur.fetchall()[0][0]
                stuff.append({
                    'className' : class_name,
                    'title' : item[1],
                    'location' : item[2],
                    'starttime' : item[3],
                    'description' : item[4],
                    'meetingID' : item[5]
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
