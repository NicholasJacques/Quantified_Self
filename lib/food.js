$(document).ready(function() {
  $.get( "http://localhost:3000/api/foods", function( data ) {
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



    // if (name == '') {
    //   $("#new-food-form").append("<p id='errors'>Please enter a food Name</p>");
    // }
    // if (calories == '') {
    //   $("#new-food-form").append("<p id='errors'>Please enter a calorie amount</p>");
    // } else {
    //   addFoodToFoodsTable(name, calories)
    //   $('#errors').text('');  
    // }
  })

  $("#food-table").on('click', 'button', function(e) {
    let id = $(e.target).parent().parent().attr('id')

    deleteFood(id)
  })
})

$(function() {
    $('form[name="myform"]').submit(function(e) {
        var username = $('form[name="myform"] input[name="username"]').val();
        if ( username == '') {
            e.preventDefault();
            $('#errors').text('*Please enter a username*');
        }
    });
});



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
      <td>${food.name}</td>
      <td>${food.calories}</td>
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
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><button class="delete glyphicon glyphicon-trash"></button></td>
    </tr>`
}
