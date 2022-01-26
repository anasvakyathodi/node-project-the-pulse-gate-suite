const express = require("express"); 
const cors = require("cors"); 
const mongoose = require("mongoose"); 
require("dotenv").config();

//setup express
const app = express();
app.use(express.json()); //middleware to manage recieving json from request
app.use(cors()); //for sending json data as response

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server run successfully on port ${PORT}`)); //now listening to port 5000

//setup mongoose
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("MongoDB connected successfully !");
  }
);

//setup routes
app.use("/users", require("./routes/userRoutes"));  
app.use("/articles",require("./routes/articleRoutes"));