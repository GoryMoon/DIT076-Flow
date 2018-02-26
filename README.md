# README

This base is coppied from a workshop and is very much WIP.
The only changes that have been done atm is the index page, the rest of the files are unchanged as a reference for the full implementation of the code.

Part from the old description:
This is an ES6 "in-house MVC" client application running in the browser
(reason for in-house: Any framework too complex)
The view layer (HTML) uses "Datatables" (jqueryPlugin). Lots of
functionality built in. Possible have to explore a bit.

## Group members
- GoryMoon: Gustaf Järgren
- maglar: Magnus Larsson
- zoizer: Filip Törnqvist

## To run client
- `cd client`
- `npm install`
- In one terminal run `npm run build`
- In another terminal run `npm start`

- Visit localhost:3000

## To run server
- Start MySQL server
- Ensure that the MySQL server is configured as per server\src\main\webapp\WEB-INF\glassfish-resources.xml concerning database, user and password
- Open in NetBeans, build and deploy
- Use localhost:8080 (Currently)
