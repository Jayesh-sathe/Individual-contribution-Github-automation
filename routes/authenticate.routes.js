module.exports = app => {
    const authenticate = require("../controllers/authenticate.controller.js");

    var router = require("express").Router();

    

    // Declare the redirect route
    router.get('/', (req, res) => {

    // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code
    
    fetch({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
           accept: 'application/json'
      }
      
    }).then((response) => {

        const accessToken = response.data.access_token
    console.log(response.data)
    
    // redirect the user to the home page, along with the access token
    res.redirect(`/home.html?access_token=${accessToken}`)
    });
});

   /* // Retrieve all login
    router.get("/", login.findAll);

    // Retrieve all published login
    router.get("/booked", login.findAllBookedlogin);

    // Retrieve a single login with id
    router.get("/:id", login.findOne);

    // Update a login with id
    router.put("/:id", login.update);

    // Delete a login with id
    router.delete("/:id", login.delete);

    // Create a new login
    router.delete("/", login.deleteAll); */

    app.use('/api/authenticate', router);
  };