const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();

const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Yes working!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbplfqy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  console.log("inside verify", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorize access");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
    if (error) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const categoryCollection = client
      .db("reCommerce")
      .collection("productsCategory");
    const bookedProductCollection = client
      .db("reCommerce")
      .collection("bookedProduct");
    const usersCollection = client.db("reCommerce").collection("users");

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
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const bookedProduct = await bookedProductCollection.insertOne(booking);
      res.send(bookedProduct);
    });

    app.get("/bookings",verifyJWT, async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidden access" });
      }
      console.log("token", req.headers.authorization);
      const cursor = bookedProductCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };

      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        return res.send({ accesstoken: token });
      }
      console.log(user);

      res.status(403).send({ accesstoken: "" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users', async (req,res)=> {
      const query = {};
      const users = await usersCollection.find(query).toArray()
     res.send(users);
    })
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => console.log(`server is running on port ${port}`));

//export the express API

module.exports = app;
