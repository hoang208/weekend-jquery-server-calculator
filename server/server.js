const express = require('express');

let bodyParser = require('body-parser');

const app = express();

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

//data
let calculationList=[
    {expression: "12/6", answer: "2"}
];

//get request
app.get("/calculation", function (req, res) {
    res.send(calculationList);
})


//post request
app.post("/calculation", (req, res) => {
    let newCalculation = req.body.calculationToAdd;

    console.log("new calculation:", newCalculation);
    console.log("calculationList before:", calculationList);

    calculationList.push(newCalculation);

    console.log("calculationList after:", calculationList);

    res.sendStatus(201);
});