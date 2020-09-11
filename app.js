var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override")

mongoose.connect("mongodb://localhost:27017/bikers_post",{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(()=>console.log("connected to DB..!"))
.catch( err=> console.log(err.message))

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
mongoose.set('useFindAndModify', false);
app.use(methodOverride("_method"))

//Mongoose Model Config
var bikeSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})

var Bike = mongoose.model("Bike", bikeSchema)


//Routes Config
//Home page
app.get("/",(req,res)=>{
	res.redirect("/bikes")
})

app.get("/bikes",function(req,res){
	Bike.find({},function(err, bikes){
		if(err){
			console.log("err")
		}else{
			res.render("index", {bikes:bikes})
		}
	})
})


//NewRoute
app.get("/bikes/new", (req,res)=>{
	res.render("new")
})
//Create Route
app.post("/bikes",(req,res)=>{
	Bike.create(req.body.bike,function(err,create){
		if(err){
			res.redirect("new")
		}else{
			res.redirect("/bikes")
		}
	})
})

//Show Route
app.get("/bikes/:id",function(req,res){
	Bike.findById(req.params.id,function(err, foundBike){
		if(err){
			console.log(err)
			res.redirect("/")
		}else{
			res.render("show",{bike:foundBike})
		}
	})	
})

//Edit Route
app.get("/bikes/:id/edit",(req,res)=>{
	Bike.findById(req.params.id,function(err,foundBike){
		if(err){
			res.redirect("/bikes")
		}else{
			res.render("edit",{bike:foundBike})
		}
	})
	
})

//Update Route
app.put("/bikes/:id",(req,res)=>{
	Bike.findByIdAndUpdate(req.params.id, req.body.bike,function(err, updatedBlog){
		if(err){
			res.redirect("bikes")
		}else{
			res.redirect("/bikes/" + req.params.id)
		}
	})
})

//Delete Route
app.delete("/bikes/:id",(req,res)=>{
	Bike.findByIdAndRemove(req.params.id, function(err,foundBike){
		if(err){
			res.redirect("/")
		}else{
			res.redirect("/")
		}
	})
})

app.listen(process.env.PORT || 3000, process.env.IP,()=>{
	console.log("server has started")
})