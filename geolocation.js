const express = require('express');
const app = express();

app.get('/', (req, res) => {
    navigator.geolocation.getCurrentPosition(position =>{
        long = position.coords.longitude;
        lat = position.coords.latitude;
        res.send(long);
    })   
})