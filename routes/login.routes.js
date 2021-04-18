module.exports = app => {
    const login = require("../controllers/login.controller.js");

    var router = require("express").Router();

    // Create a new login
    router.get("/", login.create);

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

    app.use('/api/login', router);
  };