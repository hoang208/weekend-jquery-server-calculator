$(document).ready(onReady);

function onReady() {
    console.log("Jquery is working")
    getCalculation();
    $('.number-btn').on('click',addNumber)
    $('.operator-btn').on('click',currentOperator)
    $('#delete-btn').on('click', deleteOutput)
    $('#clear-btn').on('click', clearOutput)
    $('#equal-btn').on('click', addCalculation);
    $('#reset-btn').on('click', resetPage)
    $('#history-list').on('click',('#table-row'), redoCalculation)
}

let operand;

function addNumber(){
    //Adds the value of the button to the current-input based on conditions
    if ($("#current-input").text() == 0) {
        $("#current-input").text($(this).text());
    } else {
        $("#current-input").text($("#current-input").text() + $(this).text());
    }
    // console.log(typeof($("#output").text()))
}
//end addNumberAndOperator

function currentOperator(){
    $(this).css("backgroundColor", "rgba(255,0,0,.25)");
    operand=$(this).text();
    $("#previous-input").text($("#current-input").text());
    $("#current-input").text("0");
}

function deleteOutput(){
    //Deletes last character in the current-input string
    let output= $("#current-input").text();
    if (!(parseInt(parseFloat(output)) == 0 && output.length === 1)) {
        $("#current-input").text(output.slice(0, output.length-1))
    } if (output.length === 1) {
        $("#current-input").text("0")
    }
}
//end deleteOutput

function clearOutput(){
    //Clears output
    $("#current-input").text("0");
    $("#previous-input").text("0");
    $('.operator-btn').css("backgroundColor", "rgba(255,255,255)")
}
//end clearOutput

function getCalculation(){
    //receives data from server
    $.ajax({
        type: 'GET',
        url: '/calculation'
    }).then(function (res) {
        renderToDOM(res);
    }).catch(
        function (err) {
            console.log("Error:",err);
            alert('Request failed, no data to retrieve.');
        }
    );
};
// end getCalculation()

function addCalculation(event){
    event.preventDefault();

    $('.operator-btn').css("backgroundColor", "rgba(255,255,255)")
    
    let currentInput= $('#current-input').text();
    let previousInput = $('#previous-input').text()

    let calculationToSend= {
        currentInput: currentInput,
        previousInput: previousInput,
        operand: operand
    };

    console.log(calculationToSend);

    //Sends current-input data to the server so it can caculate previous-input
    $.ajax(
        {
            method: 'POST',
            url: '/calculation',
            data: calculationToSend
        } 
    ).then((res) => {
            console.log('Success', res);

            getCalculation();
        }
    ).catch((err) => {
            console.log('Error:', err);
            alert(`Request failed because of invalid current-input. Please enter a valid current-input that can be correctly calculated.`);
        }
    );
};
// end addCalculation

function renderToDOM(calculations) {
    //Takes data from client after the calculations and appends it to DOM
    $('#history-list').empty();
    for (let calculation of calculations) {
        $("#previous-input").text(calculation.answer);
        $("#current-input").text("0");
        $('#history-list').append(`
             <tr id="table-row">
                <td><span id="previous-td">${calculation.previousInput}</span><span id="operand-td">${calculation.operand}</span><span id="current-td">${calculation.currentInput}</span> = ${calculation.answer}</td>
                <td><button class="redo-btn">Calculate</button></td>
            </tr>
        `); 
}
}
// end renderToDOM


function resetPage() {
    //request for delete
    $.ajax({
      method: 'DELETE',
      url: '/calculation',
    }).then(
      function (res) {
        console.log('Reset page');
        refreshData()
      }
    ).catch(
      function (err) {
        console.log('Failed to reset page');
      }
    )
  }
  //end resetPage

  function refreshData() {
    //refresh data to empty array as result of request for delete
    $("#current-input").text("0");
    $("#previous-input").text("0");
    //Receives data from server (empty data) and reflects on DOM
    $.ajax({
      method: 'GET',
      url: '/calculation',
    }).then(
      function (res) {
        console.log('Refreshed data');
        renderToDOM(res);
      }
    ).catch(
      function (err) {
        console.log('Fail to refresh data');
      }
    )
  };
  //end refreshData

  function redoCalculation(event) {
    event.preventDefault();
    //Grabs values from table data
    console.log("redo is working")
    let currentInput= $(this).find('#current-td').text();
    let previousInput= $(this).find('#previous-td').text();
    let operand= $(this).find('#operand-td').text();
    //Send values to recalculate
    let calculationToSend= {
        currentInput: currentInput,
        previousInput: previousInput,
        operand: operand
    };
    //Send data for calculation which in response will get data back and update DOM
    $.ajax(
        {
            method: 'POST',
            url: '/calculation',
            data: calculationToSend
        } 
    ).then((res) => {
            console.log('Success', res);

            getCalculation();
        }
    ).catch((err) => {
            console.log('Error:', err);
            alert(`Request failed because of invalid current-input. Please enter a valid current-input that can be correctly calculated.`);
        }
    );
  };
  //end redoCalculation