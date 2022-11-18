const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);



app.get('/articles', function(req, res){
    Article.find({}, function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        } 
    });
});

app.get('/articles/:postId', function(req, res){
    Article.findOne({_id: req.params.postId}, function(err, foundArticle){
        if(!err){
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added article to database.");
        } else {
            res.send(err);
        }
    });
});

app.put('/articles/:postId', function(req, res){
    Article.findOneAndUpdate(
        {_id: req.params.postId}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Post updated.");
            } else {
                res.send(err);
            }
        });
});

app.patch('/articles/:postId', function(req, res){
    Article.findOneAndUpdate(
        {_id: req.params.postId},
        {$set: req.body}, 
        function(err){
            if(!err){
                res.send("Updated article");
            } else {
                res.send(err);
            }
        }
    );
});

app.delete('/articles/:postId', function(req, res){
    Article.deleteOne(
        {_id: req.params.postId},
        function(err){
            if(!err){
                res.send("Article deleted");
            } else {
                res.send(err);
            }
        }
    );
});

app.delete('/articles', function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all posts.");
        } else {
            res.send(err);
        }
    });
});



app.listen(3000, function(err){
    if(!err){
        console.log("Server is listening on port 3000.");
    }
});
