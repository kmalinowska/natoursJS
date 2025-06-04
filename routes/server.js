const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

setupEnv();
setupDBConnection(process.env.DB_USER, process.env.DB_PASS).catch(
  console.error,
);
startServer(process.env.PORT || 3000);

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

function startServer(port) {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
