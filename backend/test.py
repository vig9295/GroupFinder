import dropbox


# # Get your app key and secret from the Dropbox developer website
# app_key = 'p00yuougn8p1oax'
# app_secret = 'nkimw90vmoqbml0'
#
# flow = dropbox.client.DropboxOAuth2FlowNoRedirect(app_key, app_secret)
#
# authorize_url = flow.start()
# print '1. Go to: ' + authorize_url
# print '2. Click "Allow" (you might have to log in first)'
# print '3. Copy the authorization code.'
# code = raw_input("Enter the authorization code here: ").strip()
client = dropbox.client.DropboxClient("nulQVf3lvTcAAAAAAAACZkhOkppiIWpAX6t1vFMd2S31fjm9nnXalrogOljJwmol")
#print 'linked account: ', client.account_info()

f, metadata = client.get_file_and_metadata('/storage/emulated/0/dcim/camera/20170416_184217.jpg')
out = open('stuff.jpg', 'wb')
out.write(f.read())
out.close()
print metadata
