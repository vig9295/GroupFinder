# GroupFinder Install Guide

1. Install postgresql and install heroku toolbelt. 
2. `heroku login` and enter your credentials
3. `pip install -r requirements.txt`
4. To access the database use `heroku pg:psql --app group-finder`



# Instructions for setting up Android

1. Install Android Studio. Download and follow instructions.
2. Install java, git and android studio using brew.
    `brew install java`
    `brew install git`
    `brew install android-sdk`
3. Update path to point to Android. Add this to `~/.bashrc`
     `ANDROID_HOME=/usr/local/opt/android-sdk'
4. Install Android, type `android` to open android package manager, select the 10 packages and accept stuff, and install
