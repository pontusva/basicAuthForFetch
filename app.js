const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const dotenv = require('dotenv');
const GeoIP = require("simple-geoip");
dotenv.config();
const PORT = process.env.PORT || 8080;
var cookieSession = require('cookie-session');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



let middleware = async (req, res, next) => {
  const response = await fetch('https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=' + process.env.GEO_IP_TOKEN);
  const results = await response.json();
  
  req.lat = results.location.lat;
  req.lng = results.location.lng;
  next();
}

// api call + "protected route"

app.get(process.env.SECRET_ROUTE, middleware, async (req, res) => {

    try {    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.lat}&lon=${req.lng}&appid=${process.env.API_TOKEN}`)
        const results = await response.json();
        
        const reject = () => {
            res.setHeader('www-authenticate', 'Basic')
            res.sendStatus(401)
          }
    
          const authorization = req.headers.authorization
      
          if(!authorization) {
            return reject()
          }
          const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')
      
          if(!(username === process.env.SECRET_USERNAME && password === process.env.SECRET_PASSWORD)) {
            return reject()
          }
          
        return res.json({
            success: true,
            results
        })
    } catch (err) {
        return res.status(500).json({
			success: false,
			message: err.message,
		})
    }
})


// server running locally
app.listen(PORT, 
    () => console.log("server is running on" + ' ' + PORT));