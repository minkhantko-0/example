require("../src/db/mongoose");
const owner = require("../src/models/owner");
const pet = require("../src/models/pet");

// const updateAgeAndCount = async (id, age) => {
//   const Owner = await owner.findByIdAndUpdate(id, { age });
//   const Count = await owner.countDocuments({ age });
//   return Count;
// };
//
// updateAgeAndCount("636ca974b4630290bd3e0666", 1)
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// 637108869c33ae4c1e7f3a55
const unregisterPetAndCount = async (id, owner_id) => {
  const Pet = await pet.findByIdAndDelete(id);
  const Count = await pet.countDocuments({ owner });
  return Count;
};

unregisterPetAndCount("637108869c33ae4c1e7f3a55", null)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
