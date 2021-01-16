# Educational Dashboard

This is an educational dashboard designed to replicate the student portal university students see when registering for classes. This website is complete with the ability to view courses and their sections, enroll in a course, see previously completed courses, and recommend courses based on previous courses you enjoyed. I built this website using React and a custom [API](https://github.com/avigael/test-course-api "API") I built specifically for this project. The API is used to host course information and completed course information and was built using Python and Flask.

[![Screenshot](https://raw.githubusercontent.com/avigael/education-dashboard/main/screenshot.png "Website")](https://avigael.github.io/education-dashboard/ "Website")

### More Information

This website is complete with filters and search functions. It also has a recommendation system which recommends you courses based on what courses you like. Also, if you do not meet the prerequisite for a course it will be marked with a badge that reads "Missing Requisite".

*Please note: the API this website uses is running off of a free service from Heroku. So it may take some time for the server to start up.*

## Running Locally

To run the website on your own machine make sure you have [Node.js](https://nodejs.org/en/ "Node.js") installed.
```
$ git clone https://github.com/avigael/education-dashboard.git
$ cd education-dashboard
$ npm install
$ npm start
```
