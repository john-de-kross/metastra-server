const app = require("./APP");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
