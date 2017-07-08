const assert    = require('chai').assert
const webdriver = require('selenium-webdriver')
const until = webdriver.until
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
      assert.include(food, '70')
    })

  })
})
