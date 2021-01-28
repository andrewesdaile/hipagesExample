hipages Full Stack Engineer Tech Challenge
Solution Documentation
==========================================

## Original

You can view the original description of the challenge here: ([https://github.com/hipages/tech-test-full-stack-engineer](https://github.com/hipages/tech-test-full-stack-engineer))

## Startup

Some steps are needed to get the dependencies:

* Enter the `ui` folder and run `npm install`
* Enter the `server` folder and run `npm install`

Now you need to check that the correct database host is used:

* Run `docker ps` and get the container ID of MySQL

* Run `docker inspect [container ID]` and inspect for the IP address (near the bottom)

* Go to `./server/src/config.ts` and verify that the IP address is right

Now you're ready to run the project using `docker-compose up`.

## Design choices

The NodeJS code focuses on connecting to the database and returning data to be consumed by the React UI.

Instead of placing all the API code in a single class, the main class refers to each method in it's own class, as microservices. This would make code much easier to maintain if there were 10 or 20 services.

Database queries are also split out into their own files for a similar reason.

In the UI, all the CSS is split out into classes instead of using inline style (of course :) and I tried to base classes on a bottom-up construction from smallest components to largest (i.e. divs inside rows, rows, data grid, then headers).

The rendering is all kept in React, and it makes fetch calls to get the data and fill the various data in the front end.
