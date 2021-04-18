var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const converter = require("json-2-csv");

const Blob = require("cross-blob");

var moment = require("moment"); // require
const { json } = require("express");

const app = express();

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// app.use("/images", express.static(path.join("images")));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
// simple route
//require("./app/routes/authenticate.routes")(app);

// Create a new login
const clientID = "78636703058b6ed19ace";
const clientSecret = "d4b92bd5305182c0339ab4ba35ceaa6bfd087ed5";
var access_token = "";
app.get("/", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientID}`
  );
});

app.get("/", function (req, res) {
  res.render("index", { client_id: clientID });
});

// Declare the callback route
app.get("/signin/callback", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      access_token = response.data.access_token;
      console.log("token  => " + access_token);
      res.redirect("/success");
    })
    .catch((err) => {
      res.send("error in doc");
    });
});
const accessToken = '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';

 // fetch the repositories from org for FALL-2020
 
 const repoURL =  fetch(
    `https://api.github.com/orgs/ChicoState/repos?per_page=5&page=1&direction=desc&created>=2020-08-01`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + access_token,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      repoArr1 = [];
      //pages = Math.round(arrlen/100);
      for (let i = 0; i < json.length; i++) {
        let repo = "ChicoState/" + json[i].name;
       
      

        repoArr1.push(repo);
      }

      return repoArr1;
    });
    //for (let i = 0; i < repoURL.length; i++) {
    //    let url = repoURL[i];
let query = `
  query {
    repositoryOwner (login: "ChicoState") {
        repositories(first: 1) {
          totalCount
          nodes {
            nameWithOwner
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
       
      }
  
  }`;
 
fetch('https://api.github.com/graphql', {
  method: 'POST',
  body: JSON.stringify({query}),
  headers: {
    'Authorization': `Bearer ${accessToken}`
   
  },
}).then(res => res.json())
  .then(body =>  {// {"data":{"repository":{"issues":{"totalCount":247}}}}
    let len = body['data']['repositoryOwner']['repositories']['nodes'].length;
    for (let i = 0; i < len; i++) {
        
        let name = body['data']['repositoryOwner']['repositories']['nodes'][i]['nameWithOwner']
        name = name.substring(11)
       
        query = `
  query {
        repository(owner: "ChicoState", name: "ODIT") {
            description
            forks {
              totalCount
            }
            issues(first: 100) {
              totalCount
              edges {
                node {
                  title
                  createdAt
                  closedAt
                  url
                  number
                  assignees(first:100){
                    edges {
                      node {
                        name
                      }
                    }
                   
                  }
                  labels(first:100){
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
                              
               
              
              
             
            }
            
            pullRequests {
              totalCount
            }

            project(number: 4) {
                  columns(first: 30) {
                    nodes{
                        name
                        cards(first: 30) {
                         
                            nodes {
                             
                              state
                              content {
                                ... on Issue {
                                  id
                                  number
                                  title
                                }
                              }
                            }
                          }
                        }
                      
                    
                  }
                }
              
          
          
        }
        }`;

        fetch('https://api.github.com/graphql', {
  method: 'POST',
  body: JSON.stringify({query}),
  headers: {
    'Authorization': `Bearer ${accessToken}`
   
  },
}).then(res => res.json())
  .then(body =>  {// {"
    let issueLen = body['data']['repository']['issues']['edges'].length;
    let issueArr = body['data']['repository']['issues']['edges'];
    let projectsArr = body['data']['repository']['project']['columns']['nodes'].length;
    let projectsArrLen  = body['data']['repository']['project']['columns']['nodes'];
    body['data']['repository']['projects']
    console.log(name);
    for (let i = 0; i < issueLen ; i++) {
      console.log(issueArr[i]['node']['number']);
      console.log(issueArr[i]['node']['title']);
      console.log(issueArr[i]['node']['closedAt']);
      console.log(issueArr[i]['node']['createdAt']);
      let assign = issueArr[i]['node']['assignees']['edges'].length;
      let reqArr = issueArr[i]['node']['assignees']['edges'];
      let assignArr = [];
       
      for (let j =0; j < assign; j++) {
       
        assignArr[j] = reqArr[j]['node']['name'];
      }
      console.log(assignArr.toString());
      console.log("project arr => " + projectsArrLen.length);
      console.log("colArr arr => " + projectsArr[0]);
      for (let i = 0; i < projectsArrLen ; i++) {
        let colArr = projectsArr[i]['nodes'];
        let colArrLen = projectsArr[i]['nodes'].length;
      
        //console.log("colArr arr => " + projectsArr[i]['node']['columns']['edges'].length);
        for (let j = 0; j < colArrLen; j++) {
         // let cardArr = colArr[j]['node']['cards'];
         // let cardArrLen = colArr[j]['node']['cards']['edges'].length;
         // for (let k = 0; k < cardArrLen; k++) {
            console.log("card => " + colArr[j]);
          //}
        }

      }
      
      
    }
    //console.log(body)
    })
    .catch(error => console.error(error));
       
        
   }
  

}) .catch(error => console.error(error));

//}