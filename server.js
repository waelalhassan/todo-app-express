const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan")
const path = require("path")
const router = require("./server/routes/router")
const connection = require("./server/database/database")
const app = express()

// init body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// init env
dotenv.config({path: '.env'})
// port
const PORT = process.env.PORT || 3000
// init connection
connection()

// log HTTP request
app.use(morgan("dev"))

// init view engine
app.set("view engine", "ejs")

// init router  
app.use(router)

// init static
app.use(express.static(path.join(__dirname, "/assets")));


app.listen(PORT, () => console.log(`server running... localhost:${PORT}`))