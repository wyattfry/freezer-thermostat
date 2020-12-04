# Freezer Thermostat
Home automation software for monitoring and controller a freezer using a raspberry pi

Development Blog: [here](https://wyattfry.com/freezer-blog.html)

Consists of
- node_app: the read-only monitoring website
- node_recorder: the worker that saves the temperature data to a mySql database, and turns the relay on/off that controls the freezer

Proposed change:
Host dashboard in cloud, acts more like a CMS, rpi sends readings to it
