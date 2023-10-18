const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const docketSchema = new mongoose.Schema({
    Name: String,
    StartTime: String,
    EndTime: String,
    HoursWorked: Number,
    RatePerHour: Number,
    Supplier: String,
    PurchaseOrder: String,
  });

  const Docket = mongoose.model('docket', docketSchema, 'dockets');

// Your MongoDB URL
const dbURL = 'mongodb+srv://naruto:naruto@cluster0.be644zi.mongodb.net/db?retryWrites=true&w=majority';
app.use(cors());
app.use(express.json())
// Connect to MongoDB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Mongoose model for the "data" collection
const dataSchema = new mongoose.Schema({
  // Define your schema fields based on your document structure
});

const Data = mongoose.model('data', dataSchema, 'data');

// Get all unique suppliers
app.get('/api/unique-suppliers', async (req, res) => {
  try {
    const uniqueSuppliers = await Data.distinct('Supplier');
    res.send(uniqueSuppliers);
  } catch (err) {
    console.error('Error fetching unique suppliers:', err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Get purchase orders for a specific supplier
app.get('/api/purchase-orders/:supplierName', async (req, res) => {
  const { supplierName } = req.params;
  console.log(supplierName)

  try {
    const purchaseOrdersForSpecificSupplier = await Data.find({ Supplier: supplierName }).distinct('PO Number')
    res.send(purchaseOrdersForSpecificSupplier);

  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    res.status(500).send({ error: 'An error occurred' });
  }
  
});

app.get('/api/dockets', async (req, res) => {
    try {
      const dockets = await Docket.find();
      res.json(dockets);
    } catch (error) {
      console.error('Error fetching dockets:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


app.post('/api/create-docket', async (req, res) => {
    // Get data from the request body
    const {
      name,
      startTime,
      endTime,
      hoursWorked,
      ratePerHour,
      selectedSupplier,
      selectedPurchaseOrder,
    } = req.body;
  
    try {
      // Create a new document in the "dockets" collection with the submitted data
      const newDocket = new Docket({
        Name: name,
        StartTime: startTime,
        EndTime: endTime,
        HoursWorked: hoursWorked,
        RatePerHour: ratePerHour,
        Supplier: selectedSupplier,
        PurchaseOrder: selectedPurchaseOrder,
      });
  
      // Save the new docket
      await newDocket.save();
  
      res.status(201).json({ message: 'Docket created successfully' });
    } catch (error) {
      console.error('Error creating docket:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Create a route to fetch the description for a specific PO number
  app.get('/api/description/:poNumberPart', async (req, res) => {
    const { poNumberPart } = req.params;
    console.log(poNumberPart)
  
    try {
      // Fetch the description for the selected PO number
      const description = await Data.findOne({ "PO Number": { $regex: new RegExp(`/${poNumberPart}$`) } }, 'Description');
      res.send(description)
    } catch (error) {
      console.error('Error fetching description:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
});

  
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
