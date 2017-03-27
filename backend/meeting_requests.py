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


def add_meeting_members_request(meetingID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("INSERT INTO meeting_members_requested (meetingID, memberID) VALUES " +
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
                    'message': 'Member successfully requested to join class'
                }
            )

def accept_request(meetingID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("DELETE FROM meeting_members_requested WHERE meetingID = %s AND memberID = %s",
                                            (meetingID, memberID))
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
                    'message': 'Member added to class'
                }
            )

def ignore_request(meetingID, memberID):
    db = connect()

    with db.cursor() as cur:
        try:
            cur.execute("DELETE FROM meeting_members_requested WHERE meetingID = %s AND memberID = %s",
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
                    'message': 'Member request removed'
                }
            )

def get_requests(adminID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT memberID, meetingID FROM meeting_members_requested WHERE meetingID in (SELECT meetingID FROM meetings WHERE memberID= %s)", (adminID,))
            details = cur.fetchall()
            stuff = []
            for item in details:
                cur.execute("SELECT name from members WHERE memberID = %s", (item[0], ))
                memberName = cur.fetchall()[0][0]

                cur.execute("SELECT title, classID from meetings WHERE meetingID = %s", (item[1], ))
                fetchData = cur.fetchall()[0]
                title = fetchData[0]
                classID = fetchData[1]
                cur.execute("SELECT name from classes WHERE classID = %s", (classID, ))
                className = cur.fetchall()[0][0]
                stuff.append({
                    'memberID' : item[0],
                    'meetingID' : item[1],
                    'memberName' : memberName,
                    'meetingTitle' : title,
                    'className' : className,
                    'classID' : classID
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
