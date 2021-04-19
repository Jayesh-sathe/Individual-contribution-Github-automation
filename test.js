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
const clientID = "xxxxxxxxxxxxxxxxxxxxxx";
const clientSecret = "xxxxxxxxxxxxxxxxxxxxxxx";
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

app.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  }).then((response) => {
    res.render("success", { userData: response.data });
    getIssuesFromRepos(access_token).then((data) => {

      
      Promise.all(data).then((res) => {
        

       // console.log("RES => " + res2[0])
      });
      /* Promise.all(data).then((res) => {
        Promise.all(res).then((res2) => {
          console.log("DAD +> " + res2[0]);
          converter.json2csv(res2, (err, csv) => {
            if (err) {
              throw err;
            }
            csv = csv + "\r\n";
            // print CSV string
            console.log(csv);

            // write CSV to a file
            fs.writeFileSync("commitdata.csv", csv);
          });
        });
      }); */
    });
  });
});
//require("./app/routes/login.routes")(app);

app.get("/repo", function (req, res) {
  const csvData = [];
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const username = "VioletInferno";
const repo = "ChicoState/ODIT";
/*
fetch(`https://github.com/login/oauth/authorize`, {
  method: "get"

});*/

async function test() {
  let resp = await fetch(
    `https://api.github.com/search/issues?q=is:closed is:issue repo:${repo}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        //Authorization: 'token ' + access_token
      },
    }
  );

  let data = await resp.json();
  let arr = data.items;

  let resp2 = await subfun(arr);

  let json = await resp2.json();
  for (var key in json) {
    //  console.log(key + " => " + json[key]);
    if (key == "items") {
      for (var item in json[key]) {
        console.log(json[key][item].user.login);
        console.log(json[key][item].url);
        console.log("created at => " + json[key][item].created_at);
        console.log("closed at => " + json[key][item].closed_at);
        console.log("*************************************");
      }
    }
  }
}

const getIssuesFromRepos = async function (access_token) {
  const repo = [];

  const repoFetch = await fetch(
    `https://api.github.com/orgs/ChicoState/repos?per_page=2&page=1&direction=desc`,
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

        //console.log("name parent => " + repo);
      }

      return repoArr1;
    });
   
    fetch(
        `https://api.github.com/search/issues?q=is:closed is:issue repo:${repoData}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "token " + access_token,
          },
        }
      )
        .then((res) => res.json())
        .then( async (json) => {
          let status;
    
          let arr = json.items;
    
          let jsonArr = [];
          
          for (let i = 0; i < arr.length; i++) {
            let data = arr[i];
    
            //      arr.forEach((data) => {
            //  const obj =    fetchJson(data);
    
            //fetch(`https://api.github.com/search/issues?q=is:closed assignee:${data.assignee.login} repo:${repo}`, {
           // console.log(" data number => " + data.number);
            var obj = await  fetch(
              `https://api.github.com/repos/${repoData}/issues/${data.number}`,
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
                jsonObj = {};
                // console.log("Issue no: # " + json.number);
    
                // jsonObj.repoName = json.repository_url.substring(json.repository_url.lastIndexOf("/"), json.repository_url.length - 1)
                jsonObj.repoName = repoData;
    
                arr2 = json.assignees;
                //  console.log("Assigned to : \n" );
                assigneeArr = [];
    
                for (let val in arr2) {
                  
                  if (val == "login") assigneeArr.push(arr2[val]);
                }
                jsonObj.assignees = assigneeArr.toString();
    
                // console.log("labels: ");
                labelArr = json.labels;
                lblArr = [];
                for (let val in labelArr) {
                  //console.log("\t " + val.description);
                  if (val == "description")  lblArr.push(labelArr[val]);
                }
                jsonObj.labels = lblArr.toString();
    
                arr = json.closed_by;
    
                //  console.log("Closed by :" );
                for (var key in arr) {
                  
                  if (key == "login")
                    ////  console.log("\t " +  arr.login);
                    jsonObj.closedBy = arr[key];
                }
    
                jsonObj.createdAt = moment(json.created_at).format(
                  "DD-MM-YYYY HH:mm"
                );
                jsonObj.closedAt = moment(json.closed_at).format(
                  "DD-MM-YYYY HH:mm"
                );
                 console.log(" repo name => " + jsonObj.repoName)
    
                return jsonObj;
              });
    
            jsonArr.push(obj);
          }
    
         console.log("jsonarr len => ", jsonArr.length);
          return jsonArr;
        });
 /* for (let i = 0; i < repoFetch.length; i++) {
    let url = repoFetch[i];
    console.log(" NEW REPO => " + url);

    const res = await getData(url);
    console.log(res);
  } */
  return repoFetch;
};

const getData =   function (repoData) {
  return   fetch(
    `https://api.github.com/search/issues?q=is:closed is:issue repo:${repoData}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + access_token,
      },
    }
  )
    .then((res) => res.json())
    .then( async (json) => {
      let status;

      let arr = json.items;

      let jsonArr = [];
      
      for (let i = 0; i < arr.length; i++) {
        let data = arr[i];

        //      arr.forEach((data) => {
        //  const obj =    fetchJson(data);

        //fetch(`https://api.github.com/search/issues?q=is:closed assignee:${data.assignee.login} repo:${repo}`, {
       // console.log(" data number => " + data.number);
        var obj = await  fetch(
          `https://api.github.com/repos/${repoData}/issues/${data.number}`,
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
            jsonObj = {};
            // console.log("Issue no: # " + json.number);

            // jsonObj.repoName = json.repository_url.substring(json.repository_url.lastIndexOf("/"), json.repository_url.length - 1)
            jsonObj.repoName = repoData;

            arr2 = json.assignees;
            //  console.log("Assigned to : \n" );
            assigneeArr = [];

            for (let val in arr2) {
              
              if (val == "login") assigneeArr.push(arr2[val]);
            }
            jsonObj.assignees = assigneeArr.toString();

            // console.log("labels: ");
            labelArr = json.labels;
            lblArr = [];
            for (let val in labelArr) {
              //console.log("\t " + val.description);
              if (val == "description")  lblArr.push(labelArr[val]);
            }
            jsonObj.labels = lblArr.toString();

            arr = json.closed_by;

            //  console.log("Closed by :" );
            for (var key in arr) {
              
              if (key == "login")
                ////  console.log("\t " +  arr.login);
                jsonObj.closedBy = arr[key];
            }

            jsonObj.createdAt = moment(json.created_at).format(
              "DD-MM-YYYY HH:mm"
            );
            jsonObj.closedAt = moment(json.closed_at).format(
              "DD-MM-YYYY HH:mm"
            );
             console.log(" repo name => " + jsonObj.repoName)

            return jsonObj;
          });

        jsonArr.push(obj);
      }

     console.log("jsonarr len => ", jsonArr.length);
      return jsonArr;
    });
};
const writeCSV = function (data) {
  const csvrows = [];
  const headers = Object.keys(data[0]);
  csvrows.push(headers.join(","));

  //console.log(headers);
  //loop over rows
  for (const row of data) {
    const values = headers.map((header) => {
      const escape = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escape}"`;
    });
    csvrows.push(values.join(","));
  }
  return csvrows.join("\n");
};

//downloadCSV(csvData);

const downloadCSV = function (data) {
  //console.log("BLOD PRE => " , data);

  const blob = new Blob([data], { type: "text/csv" });
  const url = (window.URL ? URL : window.webkitURL).createObjectURL(blob);

  const c = document.createElement("a");
  c.setAttribute("hidden", "");
  c.setAttribute("href", url);
  c.setAttribute("download", "download.csv");
  document.body.appendChild(c);
  c.click();
  document.body.removeChild(c);
};

const fetchJson = function (data) {
  const obj = fetch(
    `https://api.github.com/repos/${repo}/issues/${data.number}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + "f25485980a1d4264fb80984ce50af7261f4916fc",
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      jsonObj = {};
      // console.log("Issue no: # " + json.number);
      jsonObj.issueNo = json.number;

      arr2 = json.assignees;
      //  console.log("Assigned to : \n" );
      assigneeArr = [];

      arr2.forEach((val) => {
        // console.log("\t " + val.login);
        assigneeArr.push(val.login);
      });
      jsonObj.assignees = assigneeArr.toString();

      // console.log("labels: ");
      labelArr = json.labels;
      labelArr.forEach((val) => {
        //console.log("\t " + val.description);
      });
      arr = json.closed_by;
      return jsonObj;

      console.log("\n");
    });
  return obj;
};
