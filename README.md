Using Task Queue to send cards in the future to Google Glass
=================
This sample is an App Engine application that shows the use of a App Engine push task queue to serve cards in the future. It uses Google+ Sign In to handle authentication and then uses App Engine's default task queue along with either countdown or eta to send a random text card to the timeline.

### Prerequisites

1. Create a new project in the [Google Developers Console](https://console.developers.google.com),
2. Enable Mirror API and Google+ API. Note, this differs from the other Glass quickstarts (they make reference to the deprecated profile.info scope and don't require Google+).
3. Create a new client id for web application under APIs & auth > Credentials. Make sure to add your redirect uri as http://localhost:8080/oauth2callback for local testing and https://SOMENAME.appspot.com/oauth2callback for deployment.

### Setup

1. Clone this repo
```
git clone https://github.com/justinribeiro/glass-task-future.git
```
2. Install the requirements so that our project will run (Flask, kvsession, httplib2, et cetera)
```
pip install -r requirements.txt -t lib
```
3. Replace client_secrets.json with the credentials you created in step 3 of the prerequisites (use "Download JSON" button).
4. Replace the content for the google-signin-clientid meta tag in templates/base.html with your web application client id. Maybe visit the link in the comment above that line and learn more about page level configuration for Google+ Sign In.
5. Change the application project id in app.yaml.
6. Change the subscription callbackUrl on line 138 in main.py.
6. Run the application via
```
dev_appserver.py .
```
6. Browse to http://localhost:8080/ to see the application running.
7. Sign in to the application, do some stuff.

### Where be it the future cards?

After you sign in, you'll receive a welcome card. That card has a CUSTOM menu option called "Random Ping!" that will send a response to you subscription callback handler (you did change it in step 6 correct)? This is where the future action happens:

1. The callback takes the notification and passes it to the task queue with either and eta or a countdown option (lines 205-217).
2. This inserts the task into the default queue. YOu can check the admin console Task Queue to see when those tasks will run.
3. Once it hits the run time of the task, it'll select a random text line and send you a new timeline card.
