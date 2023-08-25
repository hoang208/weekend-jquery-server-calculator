const express = require('express');

let bodyParser = require('body-parser');

const app = express();

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

//data
let calculationList=[];

//calculation function
function calculation(expression) {
    return new Function('return ' + expression)();
}

//get request
app.get("/calculation", function (req, res) {
    //send data to client.js
    res.send(calculationList);
})


//post request
app.post("/calculation", (req, res) => {
    //Grab text in expression from client.js
    let newCalculation = req.body.calculationToAdd;

    //Calculate answer of expression using calculation function
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

app.delete('/calculation', (req, res) => {
    // Reset the data
    calculationList=[];
    
    res.sendStatus(204);
  })

app.listen(PORT, () => { console.log("listening on port:", PORT); });