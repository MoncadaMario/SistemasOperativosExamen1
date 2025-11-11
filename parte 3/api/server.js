const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@db:27017/appdb?authSource=admin';

let dbClient = null;
let itemsCollection = null;

async function connectMongo() {
  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    const db = dbClient.db();
    itemsCollection = db.collection('items');
    console.log('Conectado a Mongo');
  } catch (err) {
    console.warn('No se pudo conectar a Mongo:', err.message);
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

let inMemoryItems = [{ id: 1, name: 'demo' }];

app.get('/api/items', async (req, res) => {
  if (itemsCollection) {
    const items = await itemsCollection.find().toArray();
    return res.json(items);
  }
  res.json(inMemoryItems);
});

app.post('/api/items', async (req, res) => {
  const item = req.body;
  if (itemsCollection) {
    const r = await itemsCollection.insertOne(item);
    return res.status(201).json({ insertedId: r.insertedId });
  }
  item.id = inMemoryItems.length + 1;
  inMemoryItems.push(item);
  res.status(201).json(item);
});

connectMongo().finally(() => {
  app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
});

process.on('SIGINT', async () => {
  if (dbClient) await dbClient.close();
  process.exit(0);
});
