require("../src/db/mongoose");
const owner = require("../src/models/owner");

owner
  .findByIdAndUpdate("636ca974b4630290bd3e0666", { age: 19 })
  .then((updatedOwner) => {
    return owner.countDocuments({ age: 19 });
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

