const meals = ['breakfast', 'lunch', 'dinner', 'snacks']
const appURL = 'http://localhost:3000'
let calSort = 0
let allFoods
$(document).ready(function(){
  buildAllMealTables(meals)
  foodTableCall()

  $('#meal-tables').on('click', 'button', function(e){
    let id = $(e.target).parent().parent().attr('id')
    deleteEntry(id)
  })


  $('button.add-food').on('click', function(e){
    e.preventDefault
    let meal = $(e.target).attr('data-meal')
    let foodIds = []
    $('#food-table-index').find('input[type="checkbox"]:checked').each(function(){
      foodIds.push($(this).parent().parent().attr('id'))
      this.checked = false
    })
    foodIds.forEach(function(food){
      $.ajax({
        type: 'POST',
        url: `${appURL}/api/meals/${meal}`,
        data: {id: food},
        success: function(response){
        }
      })
    })
    buildAllMealTables(meals)
  })

  $('#calories-header').on('click', function(){
    if (calSort == 0){
      $('#food-table-index tbody > tr').sort(function (a, b) {
        return +$('td.calories', b).text() > +$('td.calories', a).text();
      }).appendTo('#food-table-index tbody');
      calSort = 1
    } else if (calSort == 1){
      $('#food-table-index tbody > tr').sort(function (a, b) {
        return +$('td.calories', b).text() < +$('td.calories', a).text();
      }).appendTo('#food-table-index tbody');
      calSort = 2
    } else {
      let query = $('#filter-food-index-input').val()
      let filteredFoods = filterFoods(query)
      $( "#food-table-index tbody" ).empty().append(makeFoodTableIndex(filteredFoods))
      calSort = 0
    }
  })

  $('#filter-food-index-input').keyup( function (data) {
    let query = data.currentTarget.value
    let filteredFoods = filterFoods(query)
    $( "#food-table-index tbody" ).empty().append(makeFoodTableIndex(filteredFoods))
  })
})

function filterFoods(query) {
  let foods = allFoods.filter(function(food) {
    food = food.name.toLowerCase()
    return food.includes(query.toLowerCase())
  })
  return foods
}

function foodTableCall(){
  $.get( "http://localhost:3000/api/foods", function( data ) {
    allFoods = data
    $( "#food-table-index tbody" ).empty().append(makeFoodTableIndex(allFoods))
  })
}

function makeFoodTableIndex (data) {
  let html = ''
  data.forEach(function(food){
    html += `<tr id="${food.id}">
      <td><input type="checkbox"></td>
      <td class="name" contenteditable="true">${food.name}</td>
      <td class="calories" contenteditable="true">${food.calories}</td>
    </tr>`
  })
  return html
}

function deleteEntry(id){
  $.ajax({
    type: 'DELETE',
    url: `${appURL}/api/meals/name`,
    data: {id: id},
    success: function (response) {
      buildAllMealTables(meals)
    }
  })
}

function buildAllMealTables(meals){
  for (let i = 0; i < meals.length; i++){
    $(`table#${meals[i]} tbody`).empty()
    getFoodForMeal(meals[i]).then(function (foods){
      $(`#${meals[i]} tbody`).append(buildHTMLForMealTable(meals[i], foods))
    }).then(function () {
      buildTotalsTable()
    })
  }
}


function buildTotalsTable (){
  let dayCalories = 0
  meals.forEach(function (meal){
    if ($(`table#${meal} #meal-total`).length > 0){
      dayCalories += parseInt($(`table#${meal} #meal-total`).text())
    }
  })
  $('#calorie-totals tbody').empty().append(totalsTableHTML(dayCalories))
}

function totalsTableHTML(cals){
  return `
  <tr>
    <td>Goal Calories</td>
    <td>2000</td>
  </tr>
  <tr>
    <td>Total Calories</td>
    <td>${cals}</td>
  </tr>
  <tr class='${remainingClass((2000 - cals))}'>
    <td>Remaining Calories</td>
    <td>${2000-cals}</td>
  </tr>`
}

function getFoodForMeal(meal){
  return $.ajax({ type: "GET", url: `http://localhost:3000/api/meals/${meal}`, success: function( data ) {
    return data
  },
  error: function(data){
      return [null]
  }})
}

function buildHTMLForMealTable (meal, foods){
  let totalCalories = 0
  let html = openMealTable(meal)
    foods.forEach(function (food){
      html += `<tr id=${food.id}>
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><button class="btn delete glyphicon glyphicon-minus-sign"></button></td>
      </tr>`
      totalCalories += food.calories
    })
  let remaining = goalCalories(meal) - totalCalories
  html += calorieRows(remaining, meal, totalCalories)
  return html
}

function openMealTable(meal) {
  return ``
}

function calorieRows (remaining, meal, totalCalories) {
  return `<tr class='active'>
  <th>Total Calories</th>
  <th id='meal-total'>${totalCalories}</th>
  <th></th>
  </tr>
  <tr class='active'>
  <th>Goal Calories</th>
  <th>${goalCalories(meal)}</th>
  <th></th>
  </tr>
  <tr class='remaining-calories ${remainingClass(remaining)}' data-calories=${remaining}>
  <th>Remaining Calories</th>
  <th>${remaining}</th>
  <th></th>
  </tr>`
}

function goalCalories(meal){
  switch(meal) {
    case "breakfast":
        return 400
    case "lunch":
        return 600
    case "dinner":
        return 800
    case "snacks":
        return 200
      }
}
function remainingClass(cals){
  if (cals < 0) {
        return "danger"
  } else {
        return "success"
  }
}
