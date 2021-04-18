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
const { json, response } = require("express");

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
const clientID = "xxxxxxxxx";
const clientSecret = "xxxxxxxxxxxxxxxxxxx";
var access_token = "";
app.get("/", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=public_repo`
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
      res.redirect("/result");
     // getInformation(access_token)




      
    })
    .catch((err) => {
      res.send("error in doc");
    });
});

app.get("/result", function(req, res){
  res.json({"message": "we are here"});
 getInformation();
})

app.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  }).then(async (response) => {
    res.render("success", { userData: response.data });

    repoArr = [];
    repoArr.push("ChicoState/Portfolio");
    repoArr.push("ChicoState/PlayBuddy");
    let fieldNames = [
      "Repository Name",
      "Total Closed Issues",
      "Issue Number",
      "Issue Title",
      "Issue Status",
      "Assignees",
      "Labels",
      "Closed By",
      "Created At",
      "Issue Closed At",
    ];
    
    // fetch the repositories from org for FALL-2020
   /* const repoURL = await fetch(
      `https://api.github.com/orgs/ChicoState/repos?per_page=15&page=3&direction=desc&created>=2020-08-01`,
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
      }); */

    repoArr = ['Apetur',
    'CareMap',
    'Custom',
    'Dankbank',
    'DonateNeed',
    'EasyGrocery',
    'HotSpots',
    'RuMate',
    'SafeAlert',
    'SceneAlert'
  ];
    
    // await  Promise.all(repoURL.map((url) => {

    let topArray = [];
   /* converter.json2csv([], (err, csv) => {
      if (err) {
        throw err;
      }
      csv = csv + "\r\n";
      // print CSV string
      console.log(csv);

      // write CSV to a file
      fs.writeFileSync("data.csv", csv);
    },{  emptyFieldValue: "", keys: fieldNames } ); */
    for (let i = 0; i < repoArr.length; i++) {
      let url = "ChicoState/" + repoArr[i];
      console.log("url=> " + url);
      
     
     
      
      /*Promise.all([closedIssuesArr, openIssuesArr]).then(result => {
        const res = result.reduce((acc, result) => { 
           return acc.concat(result)
        }, [])*/
        //console.log("OUTPUT => " + res)
        converter.json2csv(
          res,
          (err, csv) => {
            if (err) {
              throw err;
            }
  
            csv += '\n'
            // write CSV to a file
            fs.writeFileSync("data.csv", csv, { flag: "a+" });
          },
          { prependHeader: false, emptyFieldValue: "None" } 
        );
     
    //  })
      

    // get open issues for 'to-do and in-progress' board
    
    }
    // } ));
  });
}); 


const getInformation =  function() {
  let fieldNames = [
    "Repository Name",
    "Total Closed Issues",
    "Issue Number",
    "Issue Title",
    "Issue Status",
    "Assignees",
    "Labels",
    
    "Issue Created At",
    "Issue Closed At",
    "Closed By"
  ];
  
  // fetch the repositories from org for FALL-2020
 /* const repoURL = await fetch(
    `https://api.github.com/orgs/ChicoState/repos?per_page=15&page=3&direction=desc&created>=2020-08-01`,
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
    }); */
repoArr1 = ['ODIT']
  repoArr = ['BlxMusicMaker',
  'Booked',
  'FreshStart',
  'GroceryPals',
  'Gruvest',
  'HappyHouseplants',
  'LifesLibrary',
  'MoneyPool',
  'PedalMaps',
  'Playbuddy',
  'Portfolio',
  'Revercipe',
  'Roohub',
  'Storebud',
  'VirtualCSUMap',
  'WhattoWatch',
  'Assistop',
  'BikeLock',
  'BookGrab',
  'BSafe',
  'DietFit',
  'DiscountAlcohol',
  'FamNet',
  'LiquorMeTimbers',
  'MusicHack',
  'ODIT',
  'ParkCore',
  'RecipeGenerator',
  'SmartCCTV',
  'StudyGroup',
  'SustainabilityPoints',
  'WildcatMobile',
  
  'Apetur',
  'CareMap',
  'Custom',
  'Dankbank',
  'DonateNeed',
  'EasyGrocery',
  'HotSpots',
  'RuMate',
  'SafeAlert',
  'SceneAlert']
  
  // await  Promise.all(repoURL.map((url) => {

  let topArray = [];
  
  converter.json2csv([], (err, csv) => {
    if (err) {
      throw err;
    }
    csv = csv + "\r\n";
    // print CSV string
    console.log(csv);

    // write CSV to a file
    fs.writeFileSync("result1.csv", csv);
  },{  emptyFieldValue: "", keys: fieldNames } );
  let offset = 0; 
  for (let i = 0; i < repoArr.length; i++) {
    //Promise.all(repoArr.map( repo => {

    
    let url = "ChicoState/" + repoArr[i];
   
    console.log("url=> " + url);
    setTimeout(async function(){
     
    const closedIssuesArr  = await getData(url);
    const openIssuesArr  = await getOpenIssues(url);
    //console.log(" openIssuesArr => " + JSON.stringify(openIssuesArr))
   try{
    const resData = await Promise.all([closedIssuesArr, openIssuesArr]).then(result => {
      
      
      const res = result.reduce((acc, result) => { 
        if (!result) return acc;
        let filtered = result.filter(function (el) {
          return el != null;
        });
         return acc.concat(filtered)
      }, [])
      return res;
      
        

    });
   
    converter.json2csv(
      resData,
      (err, csv) => {
        if (err) {
          throw err;
        }

        csv += '\n'
        // write CSV to a file
        fs.writeFileSync("result1.csv", csv, { flag: "a+" });
      },
      { prependHeader: false, emptyFieldValue: "None" } 
    );
   }catch(e) {
     console.log(e.message)
   }
   //console.log(person);
  }, 15000 + offset);    
 offset += 15000;
  /* getData(url).then(res => {
   
    
   
      //console.log("OUTPUT => " + res)
      converter.json2csv(
        res,
        (err, csv) => {
          if (err) {
            throw err;
          }

          csv += '\n'
          // write CSV to a file
          fs.writeFileSync("data.csv", csv, { flag: "a+" });
        },
        { prependHeader: false, emptyFieldValue: "None" } 
      );
   
    });
    */

  // get open issues for 'to-do and in-progress' board
  
  }
  // } ));

}

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

  const repoURL = fetch(
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
  repoArr = [];
  repoArr.push("ChicoState/Portfolio");
  repoArr.push("ChicoState/PlayBuddy");

  // for (let i = 0; i < repoArr.length; i++) {
  // let url = repoArr[i];
 // const res = getData("ChicoState/Portfolio");

  Promise.all(res).then((res1) => {
    console.log("SDSDD " + res1);
  });

  // }
  /* const data =   await Promise.all(
      repoArr.map(  (url) => {
        
        return  getData(url);
       
        
        
      }));
      await Promise.all(
        data.map(  (res) => {
          
        //  console.log(res)
         Promise.all(
          res.map(  (res1) => {
            
            console.log(res1)
           
            
            
          }));
         
          
          
        }));*/

  // console.log("result => " + result[0]);

  /* for (let i = 0; i < repoFetch.length; i++) {
    let url = repoFetch[i];
    console.log(" NEW REPO => " + url);

    const res = await getData(url);
    console.log(res);
  } */
  //return repoFetch;
};

const getData1 = async function (repoData) {
  const data = await fetch(
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
    .then(async (json) => {
      let status;

      let arr = json.items;
      let totalCount = json.total_count;
      //console.log(arr);
      console.log("Data length for issues => " + arr.total_count);
      let jsonArr = [];
      let issueArr = [];
      for (let i = 0; i < arr.length; i++) {
        let data = arr[i];
        issueArr.push(data);
      }
      console.log("issue length => " + issueArr.length);

      const result = await Promise.all(
        issueArr.map((issues) => {
          var obj = fetch(
            `https://api.github.com/repos/${repoData}/issues/${issues.number}`,
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
              jsonObj.totalClosedCount = totalCount;
              jsonObj.issueNo = json.number;
              jsonObj.title = json.title;

              arr2 = json.assignees;
              //  console.log("Assigned to : \n" );
              assigneeArr = [];

              arr2.forEach((val) => {
                // console.log("\t " + val.login);
                assigneeArr.push(val.login);
              });

              if (assigneeArr.length == 0) {
                jsonObj.assignees = "None";
              } else {
                jsonObj.assignees = assigneeArr.toString();
              }

              // console.log("labels: ");
              labelArr = json.labels;
              lblArr = [];
              labelArr.forEach((val) => {
                //console.log("\t " + val.description);
                // if (val == 'description')
                if (val.description === null || val.description.length == 0) {
                  jsonObj.labels = "None";
                } else {
                  jsonObj.labels = val.description;
                }
              });

              arr = json.closed_by;

              //  console.log("Closed by :" );
              for (var key in arr) {
                //  console.log(key);
                if (key == "login")
                  ////  console.log("\t " +  arr.login);
                  jsonObj.closedBy = arr.login;
              }

              jsonObj.createdAt = moment(json.created_at).format(
                "DD-MM-YYYY HH:mm"
              );
              jsonObj.closedAt = moment(json.closed_at).format(
                "DD-MM-YYYY HH:mm"
              );
              console.log("json jb => ", jsonObj.issueNo);
              return jsonObj;
            });
          jsonArr.push(obj);
          return jsonArr;
        })
      );

      // console.log(" result => " + result.length);
    });
  console.log(" repo data length => " + data.length);
  return data;
};

const mergeArrays = async function(arr1, arr2) {
  combined = []
  try{
   const finalarr =  await  Promise.all([arr1, arr2]).then(result => {
      
      
    const res = result.reduce((acc, result) => { 
        //console.log(" acc => ", acc)
        //console.log(" result => ", result)
        //if (!result) return acc;
       /* let filtered = result.filter(function (el) {
          return el != null;
        });*/
         return acc.concat(result)
      }, [])
      
     return res;
     
    });
   return finalarr;
   }catch(e) {
     console.log(e.message)
   }
   
}
const getOpenIssues = async function (repoData) {
  

  
  let pagecount = 1;
  let resultArr = []
  let jsonArr = []
do {

  
  
  try{


      console.log(" page count => " + pagecount);
      const data = await fetch(
        `https://api.github.com/repos/${repoData}/issues/events?per_page=100&page=${pagecount}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            accept: "application/vnd.github.starfox-preview+json",
            Authorization: "token " + access_token,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
         
          return json;
        });

       // console.log("arr => " + data)
       
      
        jsonArr = await Promise.all(
          data.map((items) => { 
          //console.log(" key => " + key + " val => " + data[key]);
         
           // console.log(" # " + d + "  => " + data[key][d] );
        
            dataVal = items
            jsonObj = {};
            
            projCard = dataVal['project_card']
            //console.log(" # " + d + "  => " + data[key][d] );
            flag = false;
            
       
        

            for (var key in projCard) {
              //console.log(" # " + key + "  => " + projCard[key] );
              if (key == "column_name" && !projCard[key].includes( 'Done') && !projCard[key].includes( 'Backlog')) {
                jsonObj.repoName = repoData;
                jsonObj.totalClosedCount = 0;
                jsonObj.issueNo = dataVal['issue']['number'];
                jsonObj.title =  dataVal['issue']['title'];
                  jsonObj.status = projCard[key];
                  flag = true;
                  break;
                  
              }
            
  
            }
  
            if (flag) {
              
              flag = false;
              arr2 = dataVal['issue']['assignees'];
              // console.log("Assigned to : \n" );
              assigneeArr = [];
      
              arr2.forEach((val) => {
                // console.log("\t " + val.login);
                assigneeArr.push(val.login);
              });
      
              //if (assigneeArr.length >  0 && event state conditiom) {
               
                jsonObj.assignees = assigneeArr.toString();
              
             // console.log("Issue no: # " + json.number);
      
              // jsonObj.repoName = json.repository_url.substring(json.repository_url.lastIndexOf("/"), json.repository_url.length - 1)
            
      
           
      
              // console.log("labels: ");
              labelArr =  dataVal['issue']['labels'];
              lblArr = [];
              labelArr.forEach((val) => {
                //console.log("\t " + val.description);
                // if (val == 'description')
                if (val.description === null || val.description.length == 0) {
                  jsonObj.labels = "None";
                } else {
                  jsonObj.labels = val.description;
                }
              });
      
            /*  arr = dataVal['issue']['closed_by'];
      
              arr.forEach((val) => {
         
           
                jsonObj.closedBy = val.login;
             })*/
            
              jsonObj.createdAt = moment( dataVal['issue']['created_at']).format("DD-MM-YYYY HH:mm");
              jsonObj.closedAt = 'None';
              jsonObj.closedBy = 'None';
              //jsonArr.push(jsonObj)
              return jsonObj;
            }
         
        }));
       if (jsonArr.length > 0) {
         
          resultArr = await  mergeArrays(jsonArr, resultArr);
         // console.log("RESULT => " + JSON.stringify(resultArr))
          
       }
       
        pagecount = pagecount + 1;
    
      
  }catch(e) {
    console.log(e.message);
  }
  
}while(jsonArr.length > 0);

return resultArr;
};
const getData = async function (repoData) {
  let totalCount = await fetch(
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
    .then(async (json) => {
      

      let totalCount = json.total_count;
      return totalCount;
    });

  if (totalCount == null) totalCount = 0;
  let totalPages = Math.ceil(parseInt(totalCount) / 100);
  if (totalPages == 0) totalPages = 1;
  let pagecount = 1;
  //console.log("total pages => " + totalPages + " repo => " + repoData);
  resultArr = [];
  while (pagecount <= totalPages) {
    const data = await fetch(
      `https://api.github.com/search/issues?q=is:closed is:issue repo:${repoData}&per_page=100&page=${pagecount}`,
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
        let arr = json.items;
        if (arr === undefined) {
          return [];
        }
        return arr;
      });
      console.log("Arr  arr length : # " + data.length);
     jsonArr = await Promise.all(
      data.map( (items) => {
        // for (let i = 0; i < data.length; i++) {
        //   let json = data[i];
        let json = items;
        jsonObj = {};
        console.log("Issue no: # " + json.number);
       
        // jsonObj.repoName = json.repository_url.substring(json.repository_url.lastIndexOf("/"), json.repository_url.length - 1)
        jsonObj.repoName = repoData;
        jsonObj.totalClosedCount = 0;
        jsonObj.issueNo = json.number;
        jsonObj.title = json.title;
        jsonObj.status = 'Done';
        arr2 = json.assignees;
        //  console.log("Assigned to : \n" );
        assigneeArr = [];

        arr2.forEach((val) => {
          // console.log("\t " + val.login);
          assigneeArr.push(val.login);
        });

        if (assigneeArr.length == 0) {
          jsonObj.assignees = "None";
        } else {
          jsonObj.assignees = assigneeArr.toString();
        }

        // console.log("labels: ");
        labelArr = json.labels;
        lblArr = [];
        labelArr.forEach((val) => {
          //console.log("\t " + val.description);
          // if (val == 'description')
          if (val.description === null || val.description.length == 0) {
            jsonObj.labels = "None";
          } else {
            jsonObj.labels = val.description;
          }
        });

       
         

        jsonObj.createdAt = moment(json.created_at).format("DD-MM-YYYY HH:mm");
        jsonObj.closedAt = moment(json.closed_at).format("DD-MM-YYYY HH:mm");
        
        return jsonObj;

        //jsonArr.push(jsonObj);
        //}
      })
    );

    
    for (per in jsonArr) {

      //console.log("number => " + JSON.stringify(jsonArr[per]))
      for (obj in jsonArr[per]) {
        //console.log("number => " + JSON.stringify(obj))
        try{

        
        if (obj != 'issueNo') {
          continue;
        }
          let issue = jsonArr[per][obj];
          //console.log("number => " + issue)
          let  closedByName = await fetch(
            `https://api.github.com/repos/${repoData}/issues/${issue}`,
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
             
              arr = json['closed_by'];
                         
              for  (let res in arr) {
                if (res == 'login') {
                  
                  return arr[res];
                }
                
              }
            });
           // console.log("closedByName => " + closedByName)
           
           jsonArr[per].closedBy = closedByName;
          }catch(e) {
            console.log(e.message)
          }
           
      }
    }
    //jsonArr.push(issueObject);
    resultArr = mergeArrays(jsonArr, resultArr);
    //console.log("result arr => " + JSON.stringify(jsonArr))
    pagecount = pagecount + 1;
  }
  //console.log("arr len => " + jsonArr.length);
  
  //console.log(JSON.stringify(topArray))
  return resultArr;
};

const getData_backup = async function (repoData) {
  let totalCount = await fetch(
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
    .then(async (json) => {
      let status;

      let totalCount = json.total_count;
      return totalCount;
    });

  if (totalCount == null) totalCount = 0;
  let totalPages = Math.ceil(parseInt(totalCount) / 100);
  if (totalPages == 0) totalPages = 1;
  let count = 1;
  console.log("total pages => " + totalPages);
  let jsonArr = [];
  while (count <= totalPages) {
    const data = await fetch(
      `https://api.github.com/search/issues?q=is:closed is:issue repo:${repoData}&per_page=100&page=${count}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + access_token,
        },
      }
    )
      .then((res) => res.json())
      .then(async (json) => {
        let arr = json.items;
        if (arr === undefined) {
          return [];
        }

        for (let i = 0; i < arr.length; i++) {
          let data = arr[i];

          // arr.forEach( (data) => {
          //  const obj =    fetchJson(data);
          // console.log("Data number >" + data.number + " rep => " + repoData);
          //fetch(`https://api.github.com/search/issues?q=is:closed assignee:${data.assignee.login} repo:${repo}`, {
          var obj = await fetch(
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
              jsonObj.totalClosedCount = totalCount;
              jsonObj.issueNo = json.number;
              jsonObj.title = json.title;

              arr2 = json.assignees;
              //  console.log("Assigned to : \n" );
              assigneeArr = [];

              arr2.forEach((val) => {
                // console.log("\t " + val.login);
                assigneeArr.push(val.login);
              });

              if (assigneeArr.length == 0) {
                jsonObj.assignees = "None";
              } else {
                jsonObj.assignees = assigneeArr.toString();
              }

              // console.log("labels: ");
              labelArr = json.labels;
              lblArr = [];
              labelArr.forEach((val) => {
                //console.log("\t " + val.description);
                // if (val == 'description')
                if (val.description.length == 0) {
                  jsonObj.labels = "None";
                } else {
                  jsonObj.labels = val.description;
                }
              });

              arr = json.closed_by;

              //  console.log("Closed by :" );
              for (var key in arr) {
                //  console.log(key);
                if (key == "login")
                  ////  console.log("\t " +  arr.login);
                  jsonObj.closedBy = arr.login;
              }

              jsonObj.createdAt = moment(json.created_at).format(
                "DD-MM-YYYY HH:mm"
              );
              jsonObj.closedAt = moment(json.closed_at).format(
                "DD-MM-YYYY HH:mm"
              );
              // console.log("json jb => ", jsonObj.issueNo)
              return jsonObj;
            });
          /*  var obj = fetch(
              `https://api.github.com/repos/${repoData}/issues/events`,
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
                for (let i = 0; i < json.length; i++) {
                  let event = json[i].event;
                  if (event == 'moved_columns_i n_project' && json[i].state == 'open') {
                      jsonObj.createdAt = json.created_at
                  }
                }
                return jsonObj;
              }); */

          jsonArr.push(obj);
        }

        return jsonArr;
      });
    count++;
    return data;
  }

  return jsonArr;
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
