const express = require('express');

let bodyParser = require('body-parser');

const app = express();

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

//data
let calculationList=[];

//get request
app.get("/calculation", function (req, res) {
    res.send(calculationList);
})


//post request
app.post("/calculation", (req, res) => {
    //Grab text in expression
    let newCalculation = req.body.calculationToAdd;

    //Calculate answer of expression
    function calculation(expression) {
        return new Function('return ' + expression)();
    }
    let answerCalculated= calculation(newCalculation)

    //Create new object that contains expression and answer
    let expressionCalculation={
        expression: newCalculation,
        answer: answerCalculated
    }

    //Push information to store in data array
    calculationList.push(expressionCalculation);

    res.sendStatus(201);
});

app.listen(PORT, () => { console.log("listening on port:", PORT); });