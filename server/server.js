const express = require('express');

let bodyParser = require('body-parser');

const app = express();

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

//data
let calculationList=[];

//calculation function
function calculation(numberOne, numberTwo, operand) {
    switch (operand) {
        case '+':
            return numberOne + numberTwo
        case '-':
            return numberOne - numberTwo
        case '*':
            return numberOne * numberTwo
        case '/':
            return numberOne / numberTwo
        default:
            return 0
    }

}

//get request
app.get("/calculation", function (req, res) {
    //send data to client.js
    res.send(calculationList);
})


//post request
app.post("/calculation", (req, res) => {
    //Grab data from client.js
    let newCalculation = req.body;

    //Calculate answer using values from client
    let currentInput = parseFloat(newCalculation.currentInput);
    let previousInput = parseFloat(newCalculation.previousInput);
    let operand = newCalculation.operand
    let answer = calculation(currentInput,previousInput,operand)
    console.log(answer)
    console.log(typeof(currentInput))
    console.log(typeof(previousInput))
    //Create new object that contains previous data + answer
    let dataWithAnswer={
        currentInput: currentInput,
        previousInput: previousInput,
        operand:operand,
        answer: answer
    }
    console.log(dataWithAnswer)
    //Push information to store in data array
    calculationList.push(dataWithAnswer);

    res.sendStatus(201);
});

app.delete('/calculation', (req, res) => {
    // Reset the data
    calculationList=[];
    
    res.sendStatus(204);
  })

app.listen(PORT, () => { console.log("listening on port:", PORT); });