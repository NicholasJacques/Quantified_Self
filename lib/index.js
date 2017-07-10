$(document).ready(function() {
  $.get( "http://localhost:3000/api/foods", function( data ) {
    $( "#food-table" ).children('tbody').append(makeFoodTable(data))
  })

  $("#new-food-submit").on('click', function(e) {
    e.preventDefault()
    let name = $("input[id='new-food-name']").val()
    let calories = $("input[id='new-food-calories']").val()
    addFoodToFoodsTable(name, calories)
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

function addFoodToFoodsTable (name, calories) {
  let html = "nana"
  $.ajax({type: 'POST', url: 'http://localhost:3000/api/foods', data: {name: name, calories: calories}, success: function(data) {
      $('#food-table').children('tbody').prepend(foodObjectToHTML(data[0]))
    }
  })
  return html
}

function foodObjectToHTML(food) {
      return `<tr id="${food.id}">
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><span class="glyphicon glyphicon-trash"></span></td>
    </tr>`
}