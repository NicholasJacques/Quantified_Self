$(document).ready(function() {
  $.get( "http://localhost:3000/api/foods", function( data ) {
    $( "#food-table" ).children('tbody').append(makeFoodTable(data))
  })
})

function makeFoodTable (data) {
  let html = ''
  data.forEach(function(food){
    html += `<tr id="${food.id}">
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><span class="glyphicon glyphicon-trash"></span></td>
    </tr>`
  })
  return html
}
