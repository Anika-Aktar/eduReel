require('dotenv').config();
const app = require('./src/app');
require('./src/db/db');
const express = require('express')

app.listen(3000 ,()=> {
console.log('Server is running on port 3000');
})
