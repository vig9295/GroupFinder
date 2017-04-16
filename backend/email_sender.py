import smtplib

def send_mail_to_admin(msg):
    toaddrs  = 'groupfindergatech@gmail.com'
    username = 'csjuniordesigngatech@gmail.com'
    password = 'groupFinder123'
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()
    server.login(username,password)
    server.sendmail(username, toaddrs, msg)
    server.quit()

send_mail_to_admin("Test Message")
