const express = require('express');
const sequelize = require('./controller/database');
const Item = require('./model/item');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON and URL-encoded body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.get('/', async (req, res) => {
  const items = await Item.findAll();
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const newItem = await Item.create({ name, description, price, quantity });
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/buy-item', async (req, res) => {
    const { itemId, quantity } = req.body;
  
    try {
      const item = await Item.findByPk(itemId);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      if (item.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough items in stock' });
      }
  
      // Update the item's quantity
      item.quantity -= quantity;
      await item.save();
  
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.get('/get-items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

// Sync the database and start the server
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });
