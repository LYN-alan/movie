var mongoose = require('../common/db');
//数据库数据集
var article = new mongoose.Schema({
        articleTitle: String,
        articleContext: String,
        articleTime: String
    })
    //通过ID查找
article.statics.findByArticleId = function(id, callBack) {
    this.find({ _id: id }, callBack)
}
article.statics.findAll = function(callBack) {
    this.find({}, callBack)
}
article.statics.findByPagination = function(pageNum,pageSize,callBack){
    this.find({},callBack).limit(pageSize).skip((pageNum-1)*pageSize)
}
var articleModel = mongoose.model('article', article)

module.exports = articleModel;