let allFoods;
const appURL = `https://ancient-reef-88532.herokuapp.com`

$(document).ready(function() {
  $.get( `${appURL}/api/foods`, function( data ) {
    allFoods = data
    $( "#food-table" ).children('tbody').append(makeFoodTable(data))
  })

  $("#new-food-submit").on('click', function(e) {
    e.preventDefault()
    let name = $("input[id='new-food-name']").val()
    let calories = $("input[id='new-food-calories']").val()
    $('.errors').remove();

    checkFoodForm(name, calories)
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
    food = food.name.toLowerCase()
    return food.includes(query.toLowerCase())
  })
  return foods
}

function checkFoodForm(name, calories) {
  if (name && calories) {
      addFoodToFoodsTable(name, calories)
      $('.errors').remove();
      $("input[id='new-food-name']").val("")
      $("input[id='new-food-calories']").val("")
  }
  !name && foodNameError()
  !calories && foodCaloriesError()
}

function foodNameError () {
  $("#new-food-form").append("<p class='errors'>Please enter a food Name</p>");
}

function foodCaloriesError () {
  $("#new-food-form").append("<p class='errors'>Please enter a calorie amount</p>");
}

function deleteFood(id) {
  $.ajax({type: 'DELETE', url: `${appURL}/api/foods/${id}`, success: function(data) {
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
  $.ajax({type: 'POST', url: `${appURL}/api/foods`, data: {name: name, calories: calories}, success: function(data) {
      allFoods.push(data[0])
      $('#food-table').children('tbody').prepend(foodObjectToHTML(data[0]))
    }
  })
}

function foodObjectToHTML(food) {
      return `<tr id="${food.id}">
      <td class="name" contenteditable="true">${food.name}</td>
      <td class="calories" contenteditable="true">${food.calories}</td>
      <td><button class="delete glyphicon glyphicon-trash"></button></td>
    </tr>`
}

function updateFood(id, name, calories) {
  $.ajax({type: 'PATCH', url: `${appURL}/api/foods/` + id, data: {name: name, calories: calories}, success: function(response) {
    allFoods = response
    }
  })
}
