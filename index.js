const fs = require("fs");
const http = require("http");
const url = require("url");

// Read file and parse JSON
const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const mortys = JSON.parse(json);

// Create server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/html" });

  // Get user path from url
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // Read and serve main page
  if (pathName === "/" || pathName === "/mortys") {
    fs.readFile(`${__dirname}/index.html`, "utf-8", (err, data) => {
      let overviewOutput = data;

      fs.readFile(
        `${__dirname}/data/templates/morty-template-card.html`,
        "utf-8",
        (err, data) => {
          // Call function to create each Morty (product) card
          let mortyMap = mortys.map(el => replaceTemplate(data, el)).join(" ");

          // Inject Mortys (products) into html
          overviewOutput = overviewOutput.replace("{%CARDS%}", mortyMap);
          res.end(overviewOutput);
        }
      );
    });

    // Read and serve appropriate Morty (product) page
  } else if (pathName === "/morty" && parseInt(id) <= mortys.length - 1) {
    fs.readFile(`${__dirname}/morty.html`, "utf-8", (err, data) => {
      let output = replaceTemplate(data, mortys[id]);
      res.writeHead(200, { "Content-type": "text/html" });
      console.log(id);
      res.end(output);
    });

    // Deal with images
  } else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(data);
    });

    // 404 not found page
  } else {
    fs.readFile(`${__dirname}/morty.html`, "utf-8", (err, data) => {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("URL was not found");
    });
  }
});

server.listen(1337, "127.0.0.1", () => {
  console.log("listening");
});

// Replace template filler with appropriate morty (product) data
function replaceTemplate(originalHtml, morty) {
  let output = originalHtml.replace(/{%NAME%}/g, morty.name);
  output = output.replace(/{%IMG%}/g, morty.img);
  output = output.replace(/{%NAIVETY%}/g, morty.naivety);
  output = output.replace(/{%ANNOYINGNESS%}/g, morty.annoyingness);
  output = output.replace(/{%INTELLIGENCE%}/g, morty.intelligence);
  output = output.replace(/{%OBEDIENCE%}/g, morty.obedience);
  output = output.replace(/{%PAIN%}/g, morty.pain);
  output = output.replace(/{%DESCRIPTION%}/g, morty.description);
  output = output.replace(/{%PRICE%}/g, morty.price);
  output = output.replace(/{%ID%}/g, morty.id);
  return output;
}
