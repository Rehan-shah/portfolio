const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { render, get, links } = require("express/lib/response");
const app = express();
var Essay = require('./articles.json');
const fs = require('fs');


app.use(express.static('public'));
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/" , (req , res ) => {
    res.render("home" , {mode : "" ,   background : " " , margin:"-60vh"})
});


app.get("/Essay" , (req , res ) => {
    res.render("Essay" , {
        mode : "navbar-dark" ,
        background : "  background-color: #141722;",
        data: Essay,
        margin:"60vh"
    })
});

app.get('/Essay/:Heading', (req, res) => {
    var x = req.params['Heading'];
  
    Essay.forEach(item => {
      if (item.Heading == x) {
        res.render('article', {
          heading: item.Heading,
          category: item.category,
          content: item.Content,
          image: item.image,
        });
      }
    });
  
    // If no matching essay is found, return a 404 error
    res.render(
        "404", {
            mode : "" ,   
            background : " ",
            margin:""
        }
    )
  });

app.get("/project" , (req,res) => {
 let links = [{
    title:"Shift or Not",
    paragraph : "This small project check mutiple factor like hdi , cost of living and much more tto decide wherther you should more or not",
    url: "https://rehan-shah.github.io/calc/",
    src:""
 }];

 links.forEach((link) => {
        var img = "http://s.wordpress.com/mshots/v1/" + encodeURIComponent(link.url) + "?w=400";
         link.src = img;
 })


    res.render(
        "project", {
            mode : "" ,   
            background : " ",
            links : links,
            margin:"35vh"
        }
    )
})

app.get("/Resume" , function(req,res){
    res.render (
        "under", {
            mode : "" ,   
            background : " ",
            margin:"40vh"
        }
    )
  });

 app.get("/shit" , (req, res) => {
    res.render(
        "form_Json"
    )
 })

  app.post('/shit', (req, res) => {
      // Read the existing JSON file
      console.log(req.body.Heading);
      fs.readFile('articles.json', (err, data) => {
          if (err) throw err;
  
          // Parse the JSON data
          let jsonData = JSON.parse(data);
          
          if (!Array.isArray(jsonData)) {
            // Convert jsonData into an array
            jsonData = Array.from(jsonData);
        }
          // Add the form data to the JSON data
          jsonData.push({
              Heading: req.body.Heading,
              categoary: req.body.category,
              image:req.body.image,
              Content: (req.body.Content).replace(/\n/g, "/n")
          });
  
          // Write the updated JSON data to the file
          fs.writeFile('articles.json', JSON.stringify(jsonData), (err) => {
              if (err) throw err;
              console.log('Data added to JSON file successfully!');
          });
      });
      res.send("data send");
  });

  app.get('*', function(req, res) {
    res.render(
        "404", {
            mode : "" ,   
            background : " ",
            margin:"38vh"
        }
    )
  });

app.listen(port, () => console.log(`Server started at port: ${port}`)
);
