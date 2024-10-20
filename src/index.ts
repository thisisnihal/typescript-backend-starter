import express from 'express';
import mongoose from 'mongoose';
import { conf } from './conf'; // Adjust the import according to your file structure
import { app } from './app';

console.log("starting server, using:", conf.TEST_VALUE);

mongoose
  .connect(conf.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = conf.PORT;

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });

    // Graceful shutdown
    // process.on('SIGTERM', () => {
    //   console.log('SIGTERM signal received: closing HTTP server');
    //   server.close(() => {
    //     console.log('HTTP server closed');
    //   });
    // });

    // process.on('SIGINT', () => {
    //   console.log('SIGINT signal received: closing HTTP server');
    //   server.close(() => {
    //     console.log('HTTP server closed');
    //   });
    // });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
