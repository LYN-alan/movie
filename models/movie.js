//引入数据库连接模块
var mongoose = require('../common//db');
//数据库的数据集--评论
var movie = new mongoose.Schema({
        movieName: String,
        movieImg: String,
        movieVideo: String,
        movieDownload: String,
        movieTime: String,
        movieNumSuppose: Number,
        movieNumDownload: Number,
        movieMainPage: Boolean
    })
    //数据操作的一些常用方法
movie.statics.findById = function(m_id, callBack) {
    this.find({_id: m_id }, callBack)
}
movie.statics.findAll = function(callBack) {
    this.find({}, callBack)
}
movie.statics.findByPagination = function(pageNum,pageSize,callBack){
    this.find({},callBack).limit(pageSize).skip((pageNum-1)*pageSize)
}
var movieModel = mongoose.model('movie', movie);
module.exports = movieModel;