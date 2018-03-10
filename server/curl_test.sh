#!/bin/bash
# This is (should be) an executable script (bash script)
# to test some database functionality

# Options (used by CORS preflight)
curl -v -X OPTIONS http://localhost:8080/


curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/api/account/register --data '{"email": "a@a.a", "nick": "anick", "password":"apass"}'
curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/api/account/login --data '{"email": "a@a.a", "password":"apass"}'
curl -v -X POST http://localhost:8080/api/group/create --data "name=1337 group&ownerId=2551"
curl -v -X POST http://localhost:8080/api/post/create --data "title=A title&text=Some text&usergroupId=0&posterId=2551"
curl -v -X POST http://localhost:8080/api/comment/create --data "text=ABC&postId=2552&commenterId=2551&status=0"
curl -v -X POST http://localhost:8080/api/comment --data "postId=1"
curl -v -X POST http://localhost:8080/api/membership/create --data "userId=1&userGroupId=2&status="
