var express = require('express');
var router = express.Router();
var movie = require('../models/movie');
var user = require('../models/user');
var comment = require('../models/comment');
var article = require('../models/article');
var recommend = require('../models/recommend');
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
		if(findUser[0].userAdmin && !findUser[0].userStop){
			movie.remove({_id:req.body.movieId},(err,delMovie)=>{
				res.json({status:0,message:'删除成功',data:delMovie})
			})
		}else{
			res.json({error:1,message:'用户没有权限或者已经停用'})
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
		if(findUser[0].userAdmin && !findUser[0].userStop){
			//更新操作
			movie.update({_id:req.body.movieId},saveDate,(err,updateMovie)=>{
				res.json({status:0,message:'更新成功',data:updateMovie})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
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
router.post('/checkComment',(req,res,next)=>{
	if(!req.body.commentId){
		res.json({status:1,message:'评论id传递失败'})
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
	user.findByUserName(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			//更新操作
			comment.update({_id:req.body.commentId},{check:true},(err,updatComment)=>{
				res.json({status:0,message:'审核成功',data:updatComment})
			})
		}else{
			res.json({error:0,message:'用户没有获得权限或者已经停用'})
		}
	})
})
// 删除用户的评论
router.post('/delComment',(req,res,next)=>{
	if(!req.body.commentId){
		res.json({status:1,message:'评论id传递失败'})
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
	user.findByUserName(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			//删除操作
			comment.remove({_id:req.body.commentId},(err,delComment)=>{
				res.json({status:0,message:'删除成功',data:delComment})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
// 封停用户
router.post('/stopUser',(req,res,next)=>{
	if(!req.body.userId){
		res.json({status:1,message:'用户id传递失败'})
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
	// 查找用户是否存在
	user.findByUserName(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			user.update({_id:req.body.userId},{userStop:true},(err,updateUser)=>{
				res.json({status:0,message:'封停成功',data:updateUser})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
//更新用户名密码
router.post('/changeUser',(req,res,next)=>{
	if(!req.body.userId){
		res.json({status:1,message:'用户id传递失败'})
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
	if(!req.body.newPassword){
		res.json({status:1,message:'用户新密码错误'})
	}
	user.findByUsername(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			user.update({_id:req.body.userId},{password:req.body.newPassword},(err,updateUser)=>{
				//返回需要的内容
				res.json({status:0,message:'修改成功',data:updateUser})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
//后端所有用户的资料显示
router.post('/showUser',(req,res,next)=>{
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
		if(findUser[0].userAdmin && !findUser[0].userStop){
			user.findAll((err,allUser)=>{
				res.json({status:1,message:'获取成功',data:allUser})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
//管理用户权限
router.post('/powerUpdate',(req,res,next)=>{
	if(!req.body.userId){
		res.json({status:1,message:'用户id传递失败'})
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
		if(findUser[0].userAdmin && !findUser.userStop){
			user.update({_id:req.body.userId},{userAdmin:true},(err,updateUser)=>{
				res.json({status:0,message:'修改成功',data:updateUser})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
// 后台新增文章
router.post('/addArticle',(req,res,next)=>{
	if(!req.body.token){
		res.json({status:1,message:'登录出错'})
	}
	if(!req.body.id){
		res.json({status:1,message:'用户传递错误'})
	}
	if(!req.body.articleTitle){
		res.json({status:1,message:'文章名称为空'})
	}
	if(!req.body.articleContext){
		res.json({status:1,message:'文章内容为空'})
	}
	user.findByUsername(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			//在有权限的情况下
			var saveArticle = new article({
				articleTitle:req.body.articleTitle,
				articleContext:req.body.articleContext,
				articleTime:Date.now()
			})
			saveArticle.save((err)=>{
				if(err){
					res.json({status:1,message:err})
				}else{
					res.json({status:0,message:'保存成功'})
				}
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
// 后台删除文章
router.post('/delArticle',(req,res,next)=>{
	if(!req.body.articleId){
		res.json({status:1,message:'文章id传递失败'})
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
		if(findUser[0].userAdmin && !findUser[0].userStop){
			article.remove({_id:req.body.articleId},(err,delArticle)=>{
				res.json({status:0,message:'删除成功',data:delArticle})
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
// 新增主页推荐
router.post('/addRecommend',(req,res,next)=>{
	if(!req.body.token){
		res.json({status:1,message:'登录出错'})
	}
	if(!req.body.id){
		res.json({status:1,message:'用户传递错误'})
	}
	if(!req.body.recommendImg){
		res.json({status:1,message:'推荐图片为空'})
	}
	if(!req.body.recommendSrc){
		res.json({status:1,message:'推荐跳转地址为空'})
	}
	if(!req.body.recommendTitle){
		res.json({status:1,message:'推荐标题为空'})
	}
	user.findByUsername(req.body.username,(err,findUser)=>{
		if(findUser[0].userAdmin && !findUser[0].userStop){
			var saveRecommend = new recommend({
				recommendImg:req.body.recommendImg,
				recommendSrc:req.body.recommendSrc,
				recommendTitle:req.body.recommendTitle
			})
			saveRecommend.save(err=>{
				if(err){
					res.json({status:1,message:err})
				}else{
					res.json({status:0,message:'保存成功'})
				}
			})
		}else{
			res.json({error:1,message:'用户没有获得权限或者已经停用'})
		}
	})
})
module.exports = router;
