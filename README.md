# NC NEWS

NC News is a full stack project based around a news forum. The back and front ends are hosted separately - this repo is for the back end, which features the use of Knex.js to create tables on and seed test news article data to an SQL database, and Express.js and Supertest.js to set up and test a server to access this information. The [front end](https://github.com/lancaster-coder1991/nc-news) provides a React-based UI in the form of a news website, where the news data can be sorted through and commented on using HTTP requests and Axios.js.

This back end is hosted on Heroku, and the API paths can therefore be called upon.

Full API documentation is something I am looking to create in the future. However, if you want to test calls to the server without using the front end, then try calling the following paths in a browser:

https://georges-nc-news.herokuapp.com/api/articles

https://georges-nc-news.herokuapp.com/api/topics

https://georges-nc-news.herokuapp.com/api/users

These should all produce a valid JSON response with the relevant information.

The [front end](https://github.com/lancaster-coder1991/nc-news) provides a UI where this information and more is displayed in a user-friendly fashion.
