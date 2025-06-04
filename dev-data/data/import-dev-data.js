const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

setupEnv();
setupDBConnection(process.env.DB_USER, process.env.DB_PASS).catch(
  console.error,
);

async function setupDBConnection(user, pass) {
  const url = process.env.DB_URL.replace('<user>', user).replace(
    '<password>',
    pass,
  );
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  };
  try {
    await mongoose.connect(url, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error');
    await mongoose.disconnect();
  }
}

function setupEnv() {
  dotenv.config({ path: './.env' });
}

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data succesfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
