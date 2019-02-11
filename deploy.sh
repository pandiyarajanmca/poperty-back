#!/bin/bash
docker build -t username/rest-api .
docker push username/rest-api

username@username-host:~/projects/restApi << EOF
docker pull username/rest-api
docker stop rest-api || true
docker rm rest-api || true
docker rmi username/rest-api:current || true
docker tag username/rest-api:latest username/rest-api:current
docker run -d --restart always --name rest-api -p 3000:3000 username/rest-api:current
EOF
