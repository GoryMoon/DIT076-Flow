#!/bin/bash
# This is (should be) an executable script (bash script)
# to test some database functionality

# (Re)create database 
#curl -v http://localhost:8080/ws4/rest/db

# Options (used by CORS preflight)
curl -v -X OPTIONS http://localhost:8080/

# Get all users
curl -v -H "Accept: application/json" http://localhost:8080/api/user 

# Create new user using JSON
curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/api/user/register --data '{"email": "x@x.x", "nick": "xnick", "password":"xspass"}'


//# Create new post using JSON
// curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/flow/rest/post --data '{"text": "some text", "title": "A title", "usergroup": "public", "poster":"###"}'

# Create new post using form parameters
curl -v -X POST http://localhost:8080/api/post/create --data "title=A title&text=Some text&usergroupId=###&poster=###"
 
# Create new comment using form parameters
curl -v -X POST http://localhost:8080/api/comment/create --data "text=ABC&postId=####&commenterId=####&status=0"

# Create new group using form parameters
curl -v -X POST http://localhost:8080/api/group/create --data "name=1337 group&ownerId=####"

# Get all comments for specific post
curl -v -X POST http://localhost:8080/api/comment --data "postId=###"





curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/api/user/register --data '{"email": "a@a.a", "nick": "anick", "password":"apass"}'
curl -v -X POST -H "Content-Type: application/json" http://localhost:8080/api/user/login --data '{"email": "a@a.a", "password":"apass"}'
curl -v -X POST http://localhost:8080/api/group/create --data "name=1337 group&ownerId=2551"
curl -v -X POST http://localhost:8080/api/post/create --data "title=A title&text=Some text&usergroupId=0&posterId=2551"
curl -v -X POST http://localhost:8080/api/comment/create --data "text=ABC&postId=2552&commenterId=2551&status=0"
curl -v -X POST http://localhost:8080/api/comment --data "postId=1"
curl -v -X POST http://localhost:8080/api/membership/create --data "userId=1&userGroupId=2&status="
