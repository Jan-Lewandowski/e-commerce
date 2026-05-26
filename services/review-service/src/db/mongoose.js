import mongoose from 'mongoose';

export async function connectMongoose(uri) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function disconnectMongoose() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
