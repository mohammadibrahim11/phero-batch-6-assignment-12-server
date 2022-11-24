const express = require("express");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());

const category = require('./CategoryData/CategoryData.json');

// const categories = require('./coursedata/categories.json');





app.get('/category/:id',(req,res)=>{
    const id = parseInt(req.params.id); 
    const selectedCategory = category.find(c => c._id === id);
    res.send(selectedCategory);
})




app.get('/',(req,res)=>{
    res.send('Yes working!');

});

app.listen(5000, () => console.log(`server is running on port${port}`));

//export the express API

module.exports = app;
