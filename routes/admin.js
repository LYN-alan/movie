var express = require('express');
var router = express.Router();
var movie = require('../models/movie');
var user = require('../models/user');
var comment = require('../models/comment');
//后台管理需要验证其用户的后台管理权限
//后台管理admin，添加新的电影
router.post('/movieAdd', (req, res, next) => {
	if (!req.body.username) {
		res.json({ status: 1, message: '用户名为空' });
	}
	if (!req.body.token) {
		res.json({ status: 1, message: '登录出错' });
	}
	if (!req.body.id) {
		res.json({ status: 1, message: '用户传递错误' });
	}
	if (!req.body.movieName) {
		res.json({ status: 1, message: '电影名称为空' });
	}
	if (!req.body.movieImg) {
		res.json({ status: 1, message: '电影图片为空' });
	}
	if (!req.body.movieDownload) {
		res.json({ status: 1, message: '电影下载地址为空' });
	}
	if (!req.body.movieMainPage) {
		var movieMainPage = false;
	}

	//验证用户的情况
	user.findByUsername(req.body.username, (err, findUser) => {
		if (findUser[0].userAdmin && !findUser[0].userStop) {
			//根据数据集建立需要存入数据库的内容
			var saveMovie = new movie({
				movieName: req.body.movieName,
				movieImg: req.body.movieImg,
				movieVideo: req.body.movieVideo,
				movieDownload: req.body.movieDownload,
				movieTime: Date.now(),
				movieNumSuppose: 0,
				movieNumDownload: 0,
				movieMainPage: movieMainPage
			});
			//保存合适的数据集
			saveMovie.save((err) => {
				if (err) {
					res.json({ status: 1, message: err });
				} else {
					res.json({ status: 0, message: '添加成功' });
				}
			});
		} else {
			res.json({ error: 1, message: '用户没有获得权限或者已经停用' });
		}
	});
});
//删除电影
router.post('/movieDel',(req,res,next)=>{
	if(!req.body.movieId){
		res.json({status:1,message:'电影id传递失败'})
	}
	if(!req.body.username){
		res.json({status:1,message:'用户名为空'})
	}
	if(!req.body.token){
		res.json({status:1,message:'登录出错'})
	}
	if(!req.body.id){
		res.json({status:1,message:'用户传递错误'})
	}
	user.findByUsername(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && findUser[0].userStop){
			movie.remove({_id:req.body.movieId},(err,delMovie)=>{
				res.json({status:0,message:'删除成功',data:delMovie})
			})
		}else{
			res.json({status:1,message:'用户没有权限或者已经停用'})
		}
	})
})
//更新电影
router.post('/movieUpdate',(req,res,next)=>{
	if(!req.body.movieId){
		res.json({status:1,message:'电影id传递失败'})
	}
	if(!req.body.username){
		res.json({status:1,message:'用户名为空'})
	}
	if(!req.body.token){
		res.json({status:1,message:'登录出错'})
	}
	if(!req.body.id){
		res.json({status:1,message:'用户传递错误'})
	}
	//这里前台打包一个电影对象全部发送至后台直接储存
	var saveDate = req.body.movieInfo;
	user.findByUserName(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && findUser[0].userStop){
			//更新操作
			movie.update({_id:req.body.movieId},saveDate,(err,updateMovie)=>{
				res.json({status:0,message:'更新成功',data:updateMovie})
			})
		}
	})
})
//获取所有电影
router.get('/movie',(req,res,next)=>{
	movie.findAll((err,allMovie)=>{
		res.json({status:0,message:'获取成功',data:allMovie})
	})
})
//显示后台的所有评论
router.get('/commentsList',(req,res,next)=>{
	comment.findAll((err,allComment)=>{
		res.json({status:0,message:'获取成功',data:allComment})
	})
})

module.exports = router;
