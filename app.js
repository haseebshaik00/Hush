var express        =  require("express"),
    app            =  express(),
    mongoose       =  require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser     =  require("body-parser")
    methodOverride =  require("method-override");

var port = process.env.PORT || 8086
mongoose.connect("mongodb+srv://haseeb:haseebmongo2018@cluster0-msqtp.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.set('useFindAndModify', false);



app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine" , "ejs");
app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
	title   : String,
	image   : String,
	body    : String,
	created : {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/",function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err)
			console.log(err);
		else{
			res.render("index", {blogs : blogs});
		}
	});
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, blogs){
		if(err)
			console.log(err);
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, blogs){
		if(err)
			console.log(err);
		else{
			res.render("show", {blog : blogs});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, found){
		if(err)
			console.log(err);
		else{
			res.render("edit", {blog : found});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, update){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs/" + req.params.id);
	});
});

app.delete("/blogs/:id", function(req, res){
	Blog.findOneAndDelete(req.params.id, function(err, update){
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});

app.listen(port, function(){
	console.log("server started");
});