require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { swaggerSpec } = require("./swagg/swagger");  
const userRoutes = require("./routes/route");  
const swaggerUi = require('swagger-ui-express');  

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

module.exports = app;
