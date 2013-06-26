
/*
 * GET home page.
 */

exports.index = function(req, res){
    var moment = require('moment');
    res.render('index', { title: 'WillowTree Apps WAT Team Lunch', thedate: moment().format('YYYYMMDD') });
};