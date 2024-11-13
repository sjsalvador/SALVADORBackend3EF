const PetDTO = require("../dto/Pet.dto.js");
const { petsService } = require("../services/index.js");
const { resolve } = require("path");

const getAllPets = async (req, res) => {
  const pets = await petsService.getAll();
  res.send({ status: "success", payload: pets });
};

const createPet = async (req, res) => {
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate)
    return res.status(400).send({ status: "error", error: "Incomplete values" });
  const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
  const result = await petsService.create(pet);
  res.send({ status: "success", payload: result });
};

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;
  const petId = req.params.pid;
  const result = await petsService.update(petId, petUpdateBody);
  res.send({ status: "success", message: "pet updated" });
};

const deletePet = async (req, res) => {
  const petId = req.params.pid;
  const result = await petsService.delete(petId);
  res.send({ status: "success", message: "pet deleted" });
};

const createPetWithImage = async (req, res) => {
  const file = req.file;
  const { name, specie, birthDate } = req.body;
  if (!name || !specie || !birthDate)
    return res.status(400).send({ status: "error", error: "Incomplete values" });
  const pet = PetDTO.getPetInputFrom({
    name,
    specie,
    birthDate,
    image: resolve(__dirname, "../public/img", file.filename),
  });
  const result = await petsService.create(pet);
  res.send({ status: "success", payload: result });
};

module.exports = {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
