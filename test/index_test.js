const assert    = require('chai').assert
// const expect    = require('chai').expect
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

  test.it('has a tables for each meal', function () {
    // When I visit index.html (or just /), I see tables for each meal for today
    driver.get(`${frontEndLocation}/index.html`)
    driver.findElements({css: ".meal-table"})
    .then(function (tables){
      assert.equal(tables.length, 4)
    })
    driver.get(`${frontEndLocation}/`)
    driver.findElements({css: ".meal-table"})
    .then(function (tables){
      assert.equal(tables.length, 4)
    })
  })

  test.it('has a goal calories for each meal', function () {
    // Each meal table has Total Calories below, which is the sum of calories for each food in that meal
    driver.get(`${frontEndLocation}/index.html`)
    driver.findElement({css: "#breakfast"}).getText()
    .then(function (meal){
      assert.include(meal, "Total Calories")
    })
  })

  test.it('has a remaining calories for each meal', function () {
    // Each meal table has Total Calories below, which is the sum of calories for each food in that meal
    driver.get(`${frontEndLocation}/index.html`)
    driver.findElement({css: "#breakfast"}).getText()
    .then(function (meal){
      assert.include(meal, "Remaining Calories")
    })
  })
  test.it('has a remaining calories for each meal', function () {
    // If Remaining Calories is less than zero, it should be colored Red
    driver.get(`${frontEndLocation}/index.html`)
    let html = driver.findElement({css: "#breakfast"}).getAttribute('outerHTML')
    .then(function (html){
      assert.include(html, "danger")
    })
  })
  test.it('has totals table', function () {
    // There is a Totals table for all meals, with Goal Calories, Calories Consumed and Remaining calories
    driver.get(`${frontEndLocation}/index.html`)
    let html = driver.findElement({css: "#calorie-totals"}).getAttribute('outerHTML')
    .then(function (html){
      assert.include(html, "Remaining Calories")
      assert.include(html, "Total Calories")
      assert.include(html, "Goal Calories")
    })
  })
  test.it('has foods table', function () {
    // There is a Totals table for all meals, with Goal Calories, Calories Consumed and Remaining calories
    driver.get(`${frontEndLocation}/index.html`)
    let html = driver.findElement({css: "#food-table-index"}).getAttribute('outerHTML')
    .then(function (html){
      assert.include(html, "Food")
      assert.include(html, "Calories")
    })
  })
  test.it('can add foods to meal', function () {
    // There is a Totals table for all meals, with Goal Calories, Calories Consumed and Remaining calories
    driver.get(`${frontEndLocation}/index.html`)
    let prevRows
    driver.findElements({css: "#breakfast tr"}).then(function (rows){
      prevRows = rows.length
    })

    driver.findElement({css: "#food-table-index input[type='checkbox']"}).click()
    driver.findElement({css: "button.add-food"}).click()
    driver.findElements({css: "#breakfast tr"}).then(function (rows){
    })
  })

})
