const assert    = require('chai').assert
const expect    = require('chai').expect
const webdriver = require('selenium-webdriver')
const until     = webdriver.until
const test      = require('selenium-webdriver/testing')
const frontEndLocation = "http://localhost:8080"
const pry = require('pryjs')

test.describe('testing foods.html front end', function () {
  var driver
  this.timeout(1000000)

  test.beforeEach(function () {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build()
  })

  test.afterEach(function () {
    driver.quit()
  })

  test.it('has a table with all of the foods', function () {
    // If I visit foods.html, I should see a table of all my foods, with Name, Calories and a delete icon for each food
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "#food-table"}))
    driver.findElements({css: "tr"})
    .then(function (food) {
      assert.isAbove(food.length, 0)
    })
    driver.findElement({css: "tr[id='1']"}).getText()
    .then(function (food) {
      assert.include(food, 'banana')
      assert.include(food, '80')
    })
  })

  test.it("can create a food by filling in form", function() {
    // When I visit foods.html, I can enter a name and calorie amount, and create a new food by clicking "Add Food"
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElement({css: "input[id='new-food-name']"})
    .sendKeys("Cheesestick")
    driver.findElement({css: "input[id='new-food-calories']"})
    .sendKeys("300")
    driver.findElement({css: "button[type=submit]"})
    .click()

    driver.wait(until.elementLocated({css: "tr[id='5']"})).getText()
    .then(function (food) {
      assert.include(food, 'Cheesestick')
      assert.include(food, '300')
    })
  })

  test.it("can delete a food by click the trash can", function() {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "tr[id='5'] button"}))
    driver.findElement({css: "tr[id='5'] button.delete"})
    .click()
    driver.wait(function(){
      return driver.findElements({css: "tr"}).then(function (trs){
        return trs.length == 5
      })
    })
    driver.findElements({css: "tr"}).then(function(data) {
      assert.equal(data.length, 5)
    })
  })

  test.it("The food order persists across refresh", function () {
    let last
    let first
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElements({css: "tbody tr"})
    .then(function (data) {
      data.slice(-1)[0].getText().then(function (data){
        last = data
      })
      data[0].getText().then(function (data){
        first = data
      })
    })
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElements({css: "tbody tr"})
    .then(function (data) {
      data.slice(-1)[0].getText().then(function (data){
        assert.equal(last, data)
      })
      data[0].getText().then(function (data){
        assert.equal(first, data)
      })
    })
  })

  test.it("flashes an error message if the name field is lef empty", function () {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElement({css: "input[id='new-food-calories']"})
    .sendKeys("300")
    driver.findElement({css: "button[type=submit]"})
    .click()

    driver.wait(until.elementLocated({css: "p[class='errors']"})).getText()
    .then(function (errors) {
      assert.include(errors, 'Please enter a food Name')
    })
  })

  test.it("flashes an error message if the calories field is left empty", function () {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElement({css: "input[id='new-food-name']"})
    .sendKeys("Cheesestick")
    driver.findElement({css: "button[type=submit]"})
    .click()

    driver.wait(until.elementLocated({css: "p[class='errors']"})).getText()
    .then(function (errors) {
      assert.include(errors, 'Please enter a calorie amount')
    })
  })

  test.it("clears errors when food is successfuly created", function() {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.findElement({css: "input[id='new-food-name']"})
    .sendKeys("Cheesestick")
    driver.findElement({css: "button[type=submit]"})
    .click()

    driver.wait(until.elementLocated({css: "p[class='errors']"})).getText()
    .then(function (errors) {
      driver.findElement({css: "input[id='new-food-calories']"})
      .sendKeys("300")
      driver.findElement({css: "button[type=submit]"})
      .click()
      // kill me now
      driver.wait(until.elementLocated({css: "tr[id='6']"})).getText()
      .then(function () {
          driver.findElement({css: "#new-food-form"}).getText()
          .then(function (data) {
            expect(data).to.not.include("Please enter a calorie amount")
          })
      })
    })
  })

  test.it("name changes to an input box when clicked on", function() {
    driver.get(`${frontEndLocation}/foods.html`)
    driver.wait(until.elementLocated({css: "tr[id='1'] button"}))
    driver.findElement({css: "tr[id='1'] td.name"})
    .click()
    driver.findElement({css: "tr[id='1'] td.name"})
    .sendKeys("")
    driver.findElement({css: "tr[id='1'] td.name"})
    .sendKeys("cheeseburger")
    driver.findElement({css: 'div.container'})
    .click()
    driver.findElement({css: "tr[id='1'] td.name"}).getText()
    .then(function (data) {
      expect(data).to.not.include("Cheesestick")
      expect(data).to.include("cheeseburger")
    })
  })
})
