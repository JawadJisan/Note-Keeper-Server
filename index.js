const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config()

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://NewUser:SwVacJZaiun3gu67@cluster0.9lbzlwc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/* 
NewUser
SwVacJZaiun3gu67
*/

async function run() {
  try {
    // const database = await client.db("note-keeper");
    // const allNotes = await database.collection("allNotes");
    /*  */
    const database = await client.db("note-keeper");
    const allNotes = await database.collection("allNotes");


    /*  */
    app.get('/mdb', (req, res) => {
      res.send('MongoDB is connected successfully')
    })
/*  */
    // Insert Document => 
    app.post('/note', async (req, res) => {
      const response = await allNotes.insertOne(req.body);
      res.send(response);
    })

    // Get All notes => 
    app.get('/note', async (req, res) => {
      const query = req.query;
      const page = parseInt(query.page);
      const size = parseInt(query.size);

      const response = await allNotes.find().sort({ _id: -1 }).skip(size * page).limit(size).toArray();
      res.send(response);
    });

    // Total Data count => 
    app.get('/note/count', async (req, res) => {
      const response = await allNotes.estimatedDocumentCount();
      res.send({ count: response })
    })

    // Delete a specefic note by id => 
    app.delete('/note/:id', async (req, res) => {
      const query = { _id: ObjectId(req.params.id) }
      const response = await allNotes.deleteOne(query);
      res.send(response);
    });

    //Update a specefic note by id => 
    app.put('/note/:id', async (req, res) => {
      const find = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body
      }
      const response = await allNotes.updateOne(find, updatedDoc, options);
      res.send(response);
    });
  }
  finally {

  }


}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello  Its From NoteKeepers')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

