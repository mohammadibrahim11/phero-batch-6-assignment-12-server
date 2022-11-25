const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yes working!");
});

const uri = `mongodb+srv://user5:VqE7tcAoCJNibvL9@cluster0.gbplfqy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("reCommerce")
      .collection("productsCategory");
      const bookedProductCollection=client.db('reCommerce').collection('bookedProduct')

    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/categories/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const categoriesDetails = await categoryCollection.findOne(query);
        res.send(categoriesDetails);
      });
      app.post('/bookings', async (req,res)=> {
        const booking = req.body;
        console.log(booking);
        const bookedProduct = await bookedProductCollection.insertOne(booking);
        res.send(bookedProduct);
      });

      app.get('/bookings',  async ( req, res)=>{
        const query = {};
        const cursor = bookedProductCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      })
  } finally {
  }
}
run().catch((err) => console.log(err));


app.listen(port, () => console.log(`server is running on port ${port}`));

//export the express API

module.exports = app;
