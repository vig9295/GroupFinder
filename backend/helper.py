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

def getAdminID(meetingID):
    db = connect()
    with db.cursor() as cur:
        try:
            cur.execute("SELECT memberID from meetings WHERE meetingID = %s", (meetingID, ))
            return cur.fetchall()[0][0]
        except:
            return "Error"
