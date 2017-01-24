# Backend Installation Guide

1. Install postgresql and install heroku toolbelt. 
2. `heroku login` and enter your credentials
3. `pip install -r requirements.txt`
4. To access the database use `heroku pg:psql --app group-finder`


# Instructions for setting up Android

We will be using React Native to set up the Android side of things
https://facebook.github.io/react-native/docs/getting-started.html
The getting started page has a useful guide on how to get started.
Do not follow it completely and refer to instructions below as well.

1. Install Android Studio using instructions in the page. Note that while opening the git folder in your Android studio you will need to select the frontend/android directory.
2. Install the Android 6.0 (Marshmallow) using the procedure described. Note that the menus have changed in the latest Android Studio. Click on this button to take you to the SDK Manager. http://imgur.com/Hoi5o1z
3. Set ANDROID_HOME environment variables. Not that on your Mac the file will be called `~/.bash_profile`.
4. Build gradle and open your android emulator.
5. Run the command `react-native run-android` from within the frontend directory. This process will take a sometime however you will not need to keep running this as React Native updates on the fly.
