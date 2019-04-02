//引入相关的文件和代码包
var mongoose = require('../common/db');
//根据数据库集建立一个新的mai数据内容
var mail = new mongoose.Schema({
    fromUser:String,
    toUser:String,
    title:String,
    context:String
})
//数据库的一些常用方法
mail.statics.findByToUserId = function(user_id,callBack){
    this.find({toUser:user_id},callBack)
}
mail.statics.findByFromUserId = function(user_id,callBack){
    this.find({fromUser:user_id},callBack)
}
var mailModel = mongoose.model('mail',mail);
module.exports = mailModel;
