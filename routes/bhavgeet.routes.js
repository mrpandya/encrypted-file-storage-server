
const controller = require("../controllers/bhavgeet.controller");

module.exports = function (app) {

  app.get('/bhavgeet/:bhavgeetCode', controller.getbhavgeet);

  app.post('/bhavgeet', controller.savebhavgeet);
};