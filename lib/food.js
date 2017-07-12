let allFoods;

$(document).ready(function() {
  $.get( "http://localhost:3000/api/foods", function( data ) {
    allFoods = data
    $( "#food-table" ).children('tbody').append(makeFoodTable(data))
  })

  $("#new-food-submit").on('click', function(e) {
    e.preventDefault()
    let name = $("input[id='new-food-name']").val()
    let calories = $("input[id='new-food-calories']").val()
    $('.errors').remove();

    if (name == '' && calories == '') {
      $("#new-food-form").append("<p class='errors'>Please enter a food Name</p>");
      $("#new-food-form").append("<p class='errors'>Please enter a calorie amount</p>");
    } else if (name == '') {
      $("#new-food-form").append("<p class='errors'>Please enter a food Name</p>");
    } else if (calories == '') {
      $("#new-food-form").append("<p class='errors'>Please enter a calorie amount</p>");
    } else {
      addFoodToFoodsTable(name, calories)
      $('.errors').remove();
      $("input[id='new-food-name']").val("")
      $("input[id='new-food-calories']").val("")
    }
  })
  
  $("#food-table").on('click', 'button', function(e) {
    let id = $(e.target).parent().parent().attr('id')

    deleteFood(id)
  })

  $('#food-table').on('blur', 'tr', function(event) {
    var id = this.id
    var name = this.childNodes[1].innerText
    var calories = this.childNodes[3].innerText

    updateFood(id, name, calories)
  })

  $('#filter-food-input').keyup( function (data) {
    let query = data.currentTarget.value
    let filteredFoods = filterFoods(query)
    $( "#food-table" ).children('tbody').empty().append(makeFoodTable(filteredFoods))
  })
})

function filterFoods(query) {
  let foods = allFoods.filter(function(food) {
    return food.name.includes(query)
  })
  return foods
}

function deleteFood(id) {
  $.ajax({type: 'DELETE', url: `http://localhost:3000/api/foods/${id}`, success: function(data) {
      $(`tr[id="${id}"]`).remove()
    }
  })
}

function makeFoodTable (data) {
  let html = ''
  data.forEach(function(food){
    html += `<tr id="${food.id}">
      <td class="name" contenteditable="true">${food.name}</td>
      <td class="calories" contenteditable="true">${food.calories}</td>
      <td><button class="delete glyphicon glyphicon-trash"></button></td>
    </tr>`
  })
  return html
}

function addFoodToFoodsTable (name, calories) {
  let html
  $.ajax({type: 'POST', url: 'http://localhost:3000/api/foods', data: {name: name, calories: calories}, success: function(data) {
      $('#food-table').children('tbody').prepend(foodObjectToHTML(data[0]))
    }
  })
  return html
}

function foodObjectToHTML(food) {
      return `<tr id="${food.id}">
      <td class="name" contenteditable="true">${food.name}</td>
      <td class="calories" contenteditable="true">${food.calories}</td>
      <td><button class="delete glyphicon glyphicon-trash"></button></td>
    </tr>`
}

function updateFood(id, name, calories) {
  console.log(id)
  $.ajax({type: 'PATCH', url: 'http://localhost:3000/api/foods/' + id, data: {name: name, calories: calories}, success: function(response) {
    allFoods = response
    }
  })
}