const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
    }
  )
  .then((res) => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
