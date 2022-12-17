const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { render, get, links } = require("express/lib/response");
const app = express();
var Essay = require('./articles.json');
const fs = require('fs');
const request = require("request");
const os = require('os');
const UAParser = require('ua-parser-js');
const parser = new UAParser();
app.use(express.static('public'));
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    const userAgent = req.headers["user-agent"];
    parser.setUA(userAgent);
    let broswer = "";
    if (parser.getBrowser().name === "Safari") {
      broswer = "safari";
      console.log("The browser is Safari");
    } else {
      broswer = "";
    }
    if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
        res.render("mobile/homeM" , {mode : "" ,background :"" , broswer:"safari"});

    } else {
        res.render("home", {mode : "", background : "", margin:"-60vh" , broswer:broswer});
    }
});



app.get("/Essay" , (req , res ) => {
    const userAgent = req.headers["user-agent"];

    if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
        res.render("mobile/EssayM" , {mode : "navbar-dark" ,background : "  background-color: #141722;",  data:        Essay});
        os.screen.orientation.lock('portrait');
    } else {
        res.render("Essay" , {
            mode : "navbar-dark" ,
            background : "  background-color: #141722;",
            data: Essay,
            margin:"60vh"
        })
    }
   
});

app.get('/Essay/:Heading', (req, res) => {
    var x = req.params['Heading'];
    const userAgent = req.headers["user-agent"];

    if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
        Essay.forEach(item => {
            if (item.Heading == x) {
              res.render('mobile/articleM', {
                heading: item.Heading,
                category: item.category,
                content: item.Content,
                image: item.image,
              });
            }
          })
    }else{ 
    Essay.forEach(item => {
      if (item.Heading == x) {
        res.render('article', {
          heading: item.Heading,
          category: item.category,
          content: item.Content,
          image: item.image,
        });
      }
    })
};
  
    // If no matching essay is found, return a 404 error
    res.redirect("/efi3pi2o")
  });

app.get("/project" , (req,res) => {
    const userAgent = req.headers["user-agent"];
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

 if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
    res.render(
        "mobile/projectM", {
            mode : "" ,   
            background : " ",
            links : links,})
 } else{
    res.render(
        "project", {
            mode : "" ,   
            background : " ",
            links : links,
            margin:"35vh"
        }
    )
 }

})

app.get("/Resume" , function(req,res){
    const userAgent = req.headers["user-agent"];
    let header = "partials/header" ; 
    let footer = "partials/header"
    let margin = "38vh";
    if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
      header = "mobile/headerM.ejs";
      footer ="mobile/footerM.ejs";
      margin= "50vh"
    }
    res.render (
        "under", {
            mode : "" ,   
            background : " ",
            margin:margin,
            header:header,
            footer:footer
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
    const userAgent = req.headers["user-agent"];
    let header = "partials/header" ; 
    let footer = "partials/footer"
    let margin = "38vh";
    if (userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i)) {
      header = "mobile/headerM.ejs";
      footer ="mobile/footerM.ejs";
      margin= "50vh"
    }
    res.render(
        "404", {
            mode : "" ,   
            background : " ",
            margin:margin,
            header : header,
            footer : footer 
        }
    )
  });

app.listen(port, () => console.log(`Server started at port: ${port}`)
);
