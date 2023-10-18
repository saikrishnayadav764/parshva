const mongoose = require('mongoose');

// Your MongoDB URL
const dbURL = 'mongodb+srv://naruto:naruto@cluster0.be644zi.mongodb.net/db?retryWrites=true&w=majority';

// Create a Mongoose connection
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

// // Handle connection errors
// db.on('error', (error) => {
//   console.error('MongoDB connection error:', error);
// });

// // Handle successful connection
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });


connection.once('open', async() => {
  console.log('Connected to MongoDB');

  const collection = mongoose.model('data', new mongoose.Schema({}), 'data');

  // Find all documents in the collection
  result = await collection.find({});
  console.log(result)
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
