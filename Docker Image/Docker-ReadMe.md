# Pi Weather Station *DOCKERIZED*

This Docker Image is a containerized application originally built by Eric Elewin. Containerizing his application captures all the dependencies required to make it run. Launching the application in Docker allows for easy deployment!

These Docker images will work on RaspberryPi still but is also built to work on AMD64 infrastructure, depending on the tag you specify of course ;)

Just so you know, the original application was pre-configured to access the application from the hosting machine only. I have modified index.js to allow any machine on the local network to access the application from the web browser. By exposing the app to your entire network, users on that network access the app and retrieve your API keys from the settings page. I use this at home with my family, so I am ok with that risk. 

Eric developed this application as a weather station running on RaspberryPI on the official 7" 800x480 touchscreen. See Eric's Github located here: https://github.com/elewin/pi-weather-station#pi-weather-station 

![Pi Weather Station ](https://user-images.githubusercontent.com/15202038/91359998-4625bb80-e7bb-11ea-937e-c87eede41f35.JPG)

Compiled app data to run as a lightweight container in docker. Uses Node:12.12-alpine.

Images will work on ARM/aarch64 and x86 Linux/AMD infrastructure. 

The compose file example will be below and includes an example for persistent volumes, so API data is recovered on container recreation. 

Options will allow you to run on any physical Linux machine (including RaspberryPi), Virtual Machines, or Windows. Tested on Windows 10, Debian, and Ubuntu.

<table>
<tr>
<th>Architecture</th>
<th>Available</th>	
</tr>
<tr>
<td>amd64</td>
<td>✅</td>
</tr>
<tr>	
<td>arm64</td>
<td>✅</td>
</tr>
<tr>
<td>arm64v8</td>
<td>✅</td>
</tr>
<tr>
<td>armhf</td>
<td>✅</td>
</tr>
<td>arm32v7</td>
<td>✅	</td>
</table>

<strong>Docker Run</strong>

You can spin up the container using docker run with the following example below:

Create a Docker Volume first so that you can save persistent API Data:
```bash
docker volume create appdata
```
Using the volume example above, create the container and pull the image: 

```bash
docker run -itd --name weather-station -p 8080:8080 -v appdata:/app seanriggs/pi-weather-station
```
Remember to specify the arm64 tag if you use an arm or aarch64 based infrastructure.

![Docker Compose ](https://user-images.githubusercontent.com/111924572/188755814-af9ef5fd-9aa5-44a4-81dc-47bf7a1a5849.png)
## docker-compose.yml
```docker
version: '3'
services:
  weather-station:
    image: seanriggs/pi-weather-station:latest #or arm64 (i.e. RaspberryPi)
    container_name: weather-station
    ports:
      - "8080:8080"
    volumes:
      - appdata:/app
    restart: unless-stopped
volumes:
  appdata:
```
# Bringing up with Docker-Compose

The docker-compose command will pull the image based on the updated docker-compose.yml file you saved from above. The file should be ready to go in the directory you chose for it (i.e. pi-weather-station). The next step is to spin up your containers using docker-compose and starting the docker daemon:

```bash
docker-compose up -d
```
