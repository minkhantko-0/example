require("../src/db/mongoose");
const Pet = require("../src/models/pet");

Pet.findByIdAndDelete("636d228fce4cec1127e7b119")
  .then((res) => {
    return Pet.countDocuments({});
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
