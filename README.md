I use the Modular pattern for complete this project.

github Link: https://github.com/mottakinrahat/assignment-3Level-2
Liver Server Link: https://level-3-assignment-3.vercel.app/

How to run locally:

1.  Download this and clone the repository
2.  put npm install command for install the node modules.
3.  set your .env file and give your NODE_ENV, PORT, add url link of mongoDB as DATABASE_URL and add your username and password and project name on the link.
4.  for run the server use command: npm run start:dev

End points:

1.  create a course: https://level-3-assignment-3.vercel.app/api/course "this api is for creating a course"
2.  Get All courses: https://level-3-assignment-3.vercel.app//api/courses "Using this you can get all courses. and you can query here. if you give https://level-3-assignment-3.vercel.app//api/courses?minPrice=20.00&maxPrice=50.00 , then the data will be given according the query price and not only just you can filter with multiple fields also"

3.  Create a category: https://level-3-assignment-3.vercel.app/api/categories "This is for creating a category"
4.  get all categories: https://level-3-assignment-3.vercel.app/api/categories "This api will given all the categories"
5.  create a reviews: https://level-3-assignment-3.vercel.app/api/reviews "Using this API you can create a reviews"
6.  update a course: https://level-3-assignment-3.vercel.app/api/courses/:courseId "using this any one can update the primitive and non primitive value dynamically".

7.  https://level-3-assignment-3.vercel.app/api/courses/:courseId/reviews      "anyone can get course data with review here"
8.  https://level-3-assignment-3.vercel.app/api/courses/best                   "any one can get the best route course according to the review"
