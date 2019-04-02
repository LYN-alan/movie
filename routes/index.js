var express = require('express');
var router = express.Router();
var recommend = require('../models/recommend');
var movie = require('../models/movie');
var article = require('../models/article');
var user = require('../models/user');
//数据库的引入
var mongoose = require('mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
//定义路由
router.get('/mongooseTest', function(req, res, next) {
        mongoose.connect('mongodb://localhost/pets', { useNewUrlParser: true });
        mongoose.Promise = global.Promise;

        var Cat = mongoose.model('Cat', { name: String });

        var tom = new Cat({ name: 'Tom' });
        tom.save(function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('success insert');
            }
        })
        res.send('数据库连接测试')
    })
    //显示主页的推荐大图等
router.get('/showIndex', (req, res, next) => {
    recommend.findAll((err, getRecommend) => {
        res.json({ status: 0, message: '获取推荐', data: getRecommend })
    })
});
//显示所有的排行榜，也就是对于电影字段index的样式
router.get('/showRanking', (req, res, next) => {
    movie.find({ movieMainPage: true }, (err, getMovies) => {
        res.json({ status: 0, message: '获取主页', data: getMovies })
    })
});
//显示文章列表

router.get('/showArticle', (req, res, next) => {
    article.findAll((err, getArticles) => {
        res.json({ status: 0, message: '获取主页', data: getArticles })
    })
});
//显示文章的内容
router.post('/articleDetail', (req, res, next) => {
    if (!req.body.article_id) {
        res.json({ status: 1, message: '文章id出错' })
    }
    article.findByArticleId(req.body.article_id, (err, getArticle) => {
        res.json({ status: 0, message: '获取成功', data: getArticle })
    })
});
//显示用户个人信息的内容
router.post('/showUser', (req, res, next) => {
    if (!req.body.user_id) {
        res.json({ status: 1, message: '用户登录状态出错' })
    }
    user.findById(req.body.user_id, (err, getUser) => {
        res.json({
            status: 0,
            message: '获取成功',
            data: {
                user_id: getUser._id,
                username: getUser.username,
                userMail: getUser.userMail,
                userPhone: getUser.userPhone,
                userStop: getUser.userStop
            }
        })
    })
})
module.exports = router;