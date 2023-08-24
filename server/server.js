const express = require('express');

let bodyParser = require('body-parser');

const app = express();

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

//data
let calculationList=[

];

//get request
app.get("/calculation", function (req, res) {
    res.send(calculationList);
})


//post request
app.post("/inventory", (req, res) => {
    let newCalculation = req.body.calculationToAdd;

    console.log("new calculation:", newCalculation);
    console.log("calculationList before:", calculationList);

    calculationList.push(newCalculation);

    console.log("calculationList after:", calculationList);

    res.sendStatus(201);
});