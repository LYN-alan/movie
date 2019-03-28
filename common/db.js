var mongoose = require('mongoose');
var url = 'mongodb://localhost/movieServer';
//链接数据库
mongoose.connect(url);

module.exports = mongoose;

