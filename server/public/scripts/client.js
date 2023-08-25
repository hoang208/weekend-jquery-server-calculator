$(document).ready(onReady);

function onReady() {
    console.log("Jquery is working")
    getCalculation();
    $('.number-btn').on('click',addNumberAndOperator)
    $('.operator-btn').on('click',addNumberAndOperator)
    $('#delete-btn').on('click', deleteOutput)
    $('#clear-btn').on('click', clearOutput)
    $('#equal-btn').on('click', addCalculation);
    $('#reset-btn').on('click', resetPage)
}


function addNumberAndOperator(){
    //Adds the value of the button to the expression based on conditions
    if ($("#expression").text() == 0) {
        $("#expression").text($(this).text());
    } else {
        $("#expression").text($("#expression").text() + $(this).text());
    }
    // console.log(typeof($("#output").text()))
}
//end addNumberAndOperator

function deleteOutput(){
    //Deletes last character in the expression string
    let output= $("#expression").text();
    if (!(parseInt(parseFloat(output)) == 0 && output.length === 1)) {
        $("#expression").text(output.slice(0, output.length-1))
    } if (output.length === 1) {
        $("#expression").text("0")
    }
}
//end deleteOutput

function clearOutput(){
    //Clears output
    $("#expression").text("0");
    $("#answer").text("0");
}
//end clearOutput

function getCalculation(){
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

    let calculationToSend= $('#expression').text();

    console.log(calculationToSend);

    //Sends expression data to the server so it can caculate answer
    $.ajax(
        {
            method: 'POST',
            url: '/calculation',
            data: {
                calculationToAdd: calculationToSend
            }
        } 
    ).then((res) => {
            console.log('Success', res);

            getCalculation();
        }
    ).catch((err) => {
            console.log('Error:', err);
            alert(`Request failed because of invalid expression. Please enter a valid expression that can be correctly calculated.`);
        }
    );
};
// end addCalculation

function renderToDOM(calculations) {
    //Takes data from client after the calculations and appends it to DOM
    $('#history-list').empty();
    for (let calculation of calculations) {
        $('#answer').text(calculation.answer)
        $('#history-list').append(`
             <tr>
                <td>${calculation.expression} = ${calculation.answer}</td>
                <td><button class="redo-btn">Calculate</button></td>
            </tr>
        `); 
        console.log(calculation.answer)
}
}
// end renderToDOM


function resetPage() {
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

  function refreshData() {
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
  }