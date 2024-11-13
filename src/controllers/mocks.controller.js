const MockingService = require("../services/mocking.js");
const { usersService, petsService } = require("../services/index.js");

const getMockingPets = async (req, res) => {
    const pets = await MockingService.generateMockingPets(100);
    res.send({ status: "success", payload: pets });
};

const getMockingUsers = async (req, res) => {
    const users = await MockingService.generateMockingUsers(50);
    res.send({ status: "success", payload: users });
};

const generateData = async (req, res) => {
    const { users, pets } = req.body;
    if (!users || !pets) return res.status(400).send({ status: "error", error: "Missing parameters" });

    const generatedUsers = await MockingService.generateMockingUsers(users);
    const generatedPets = await MockingService.generateMockingPets(pets);

    await Promise.all(generatedUsers.map(user => usersService.create(user)));
    await Promise.all(generatedPets.map(pet => petsService.create(pet)));

    res.send({ status: "success", message: "Data generated and inserted" });
};

module.exports = {
    getMockingPets,
    getMockingUsers,
    generateData,
};
