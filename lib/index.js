const meals = ['breakfast', 'lunch', 'dinner', 'snacks']

buildAllMealTables(meals)

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
  let html =
  `<div class='col'>
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
  if (foods){
    foods.forEach(function (food){
      html += `<tr id =${food.id}>
      <th>${food.name}</th>
      <th>${food.calories}</th>
      </tr>`
      totalCalories += food.calories
    })
  }
  html +=
      `<tr class='success'>
      <th>Total Calories</th>
      <th>${totalCalories}</th>
      </tr>
      </tbody>
    </table>
  </div>`
  return html
}
