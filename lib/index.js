const meals = ['breakfast', 'lunch', 'dinner', 'snacks']

buildAllMealTables(meals)
setRemainingCalColor()

function setRemainingCalColor (){
  $('.remaining-calories').data(function (data){
    if (data.calories < 0){

    }
  })
}

function buildAllMealTables(meals){
  meals.forEach(function (meal){
    getFoodForMeal(meal).then(function (foods){
      $('div#meal-tables').append(buildHTMLForMealTable(meal, foods))

    })
  })
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
      html += `<tr id =${food.id}>
      <th>${food.name}</th>
      <th>${food.calories}</th>
      </tr>`
      totalCalories += food.calories
    })
  let remaining = goalCalories(meal) - totalCalories
  html += calorieRows(remaining, meal, totalCalories)
  return html
}

function openMealTable(meal) {
  return `<div class='col'>
    <table class='table table-hover meal-table' id="${meal}">
      <thead>
      <tr>
      <th><h2>${meal}</h2></th>
      </tr>
      <tr>
      <th>Name</th>
      <th>Calories</th>
      </tr>
      </thead>
      <tbody>`
}

function calorieRows (remaining, meal, totalCalories) {
  return `<tr class='active'>
  <th>Total Calories</th>
  <th>${totalCalories}</th>
  </tr>
  <tr class='active'>
  <th>Goal Calories</th>
  <th>${goalCalories(meal)}</th>
  </tr>
  <tr class='remaining-calories ${remainingClass(remaining)}' data-calories=${remaining}>
  <th>Remaining Calories</th>
  <th>${remaining}</th>
  </tr>
  </tbody>
</table>
</div>`
}

function goalCalories(meal){
  switch(meal) {
    case "breakfast":
        return 400
    case "lunch":
        return 600
    case "dinner":
        return 800
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
