## Why docker and docker-compose?

[Docker](https://www.docker.com/community-edition) is a containerisation system, [Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. In the context of Node web application development, Docker tends to be used to define a container that has the required system-level dependencies (eg. Node version, any extra database drivers). Docker Compose would be used to define dependencies outside of the Node application, for example databases.

## Usage

The Dockerfile defines what container the application will be running in (here a Node 8 default container)
__docker-compose.yml__:
* build explains which image should be used by the app service definition (in this case, it points to what would be created by running the Dockerfile)
* volumes defines what should be mounted where (in this case, we can mount the whole directory as /var/www/app. We chose to omit volume in our config)
* ports maps ports from the host system to ports inside the container
* environment sets environment variables for the container
* command determines what will be run on startup of the container, here it runs npm install followed by the server startup command
*
### Running

Start containers in background
```
 $ docker-compose up -d         # start containers in background
```

Stop/Kill

```
$ docker-compose down          # stops containers and removes containers, networks, volumes and images created by up
$ docker-compose kill          # stop containers
$ docker-compose rm            # remove stopped containers
```

If you want to rebuild after making any changes (config or otherwise)
```
$ docker-compose up -d --build # force rebuild of Dockerfiles
```

Other useful commands:

* $ docker ps                    # see list of running containers
* $ docker exec -ti [NAME] bash # ssh to the container
* $ docker images		#list images	
* $ docker rmi -f <id>   		# delete image

