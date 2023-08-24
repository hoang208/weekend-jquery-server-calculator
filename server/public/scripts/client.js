$(document).ready(onReady);

function onReady() {
    getCalculation();
    $('.number-btn').on('click',addNumberAndOperator)
    $('.operator-btn').on('click',addNumberAndOperator)
    $('#delete-btn').on('click', deleteOutput)
    $('#clear-btn').on('click', clearOutput)
    $('#equal-button').on('click', addCalculation);
}


function addNumberAndOperator(){
    if ($("#expression").text() == 0) {
        $("#expression").text($(this).text());
    } else {
        $("#expression").text($("#expression").text() + $(this).text());
    }
    // console.log(typeof($("#output").text()))
}
//end addNumberAndOperator

function deleteOutput(){
    let output= $("#expression").text();
    if (!(parseInt(parseFloat(output)) == 0 && output.length === 1)) {
        $("#expression").text(output.slice(0, output.length-1))
    } if (output.length === 1) {
        $("#expression").text("0")
    }
}
//end deleteOutput

function clearOutput(){
    $("#expression").text("0");
    $("#answer").text("0");
}
//end clearOutput

function getCalculation(){
    $.ajax({
        type: 'GET',
        url: '/inventory'
    }).then(function (res) {
        renderToDOM(res);
    }).catch(
        function (err) {
            console.log("Error:",err);
            alert('Request failed, no item list to retrieve.');
        }
    );
};
end getCalculation()

function addCalculation(event){
    event.preventDefault();
    let itemToSend={
        name: $('#name-input').val(),
        description: $('#description-input').val()
    }

    $('#name-input').val('');
    $('#description-input').val('');

    $.ajax(
        {
            method: 'POST',
            url: '/inventory',
            data: {
                itemToAdd: itemToSend
            }
        } 
    ).then((res) => {
            console.log('Success', res);

            getCalculation();
        }
    ).catch((err) => {
            console.log('Error:', err);
            alert(`Request failed, because: ${err.responseText}`);
        }
    );
};
end addCalculation

function renderToDOM(items) {
    $('#item-list').empty();
    for (let item of items) {
        $('#item-list').append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
            <tr>
        `); 
}
}
end renderToDOM


