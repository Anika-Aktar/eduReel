const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/videos.routes');

const app = express();



app.use(express.json());
app.use(cookieParser());

//app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/video',videoRoutes);

module.exports = app;