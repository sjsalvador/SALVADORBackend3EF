const chai = require('chai');
const request = require('supertest');
const app = require('../src/app.js');
const { expect } = chai;

let validAdoptionId;
let validUserId;
let validPetId;

describe('Adoption Router Tests', function () {
  this.timeout(30000);

  // Hook para preparar los datos antes de las pruebas
  before(async function () {
    try {
      const userEmail = `testuser_${Date.now()}@example.com`;
      const userRes = await request(app)
        .post('/api/users')
        .send({ first_name: 'Test', last_name: 'User', email: userEmail, password: 'password' });
      validUserId = userRes.body.payload._id;

      const petRes = await request(app)
        .post('/api/pets')
        .send({ name: 'TestPet', specie: 'Dog', birthDate: '2022-01-01' });
      validPetId = petRes.body.payload._id;

      // Crear adopción inicial para asegurar la disponibilidad de la mascota
      const adoptionRes = await request(app)
        .post(`/api/adoptions/${validUserId}/${validPetId}`);
  
      validAdoptionId = adoptionRes.body.payload._id;
    } catch (error) {
      console.error("Error en 'before all':", error);
      throw error;
    }
  });

  after(async function () {
    try {
      if (validUserId) await request(app).delete(`/api/users/${validUserId}`);
      if (validPetId) await request(app).delete(`/api/pets/${validPetId}`);
      if (validAdoptionId) await request(app).delete(`/api/adoptions/${validAdoptionId}`);
    } catch (error) {
      console.error("Error en 'after all':", error);
      throw error;
    }
  });

  it('GET /api/adoptions - debe devolver todas las adopciones', (done) => {
    request(app)
      .get('/api/adoptions')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.be.an('array');
        done();
      });
  });

  it('GET /api/adoptions/:aid - debe devolver 1a adopcion por ID', (done) => {
    request(app)
      .get(`/api/adoptions/${validAdoptionId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.be.an('object');
        done();
      });
  });

  it('GET /api/adoptions/:aid - debe devolver 404 por ID de adopcion no existente', (done) => {
    const nonExistingId = '605c72d8e3f2b2a77b1e3e17';
    request(app)
      .get(`/api/adoptions/${nonExistingId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'Adoption not found');
        done();
      });
  });

  it('POST /api/adoptions/:uid/:pid - debe crear una nueva adopcion', (done) => {
    // Restablece el estado de la mascota a no adoptada
    request(app)
      .put(`/api/pets/${validPetId}`)
      .send({ adopted: false })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
  
        // Crea la adopción
        request(app)
          .post(`/api/adoptions/${validUserId}/${validPetId}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('payload');
            done();
          });
      });
  });
  
  

  it('POST /api/adoptions/:uid/:pid - dede devolver 404 si usuario o mascota no se encuentra', (done) => {
    const invalidUserId = '605c72d8e3f2b2a77b1e3e17';
    const invalidPetId = '605c72d8e3f2b2a77b1e3e17';
    request(app)
      .post(`/api/adoptions/${invalidUserId}/${invalidPetId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        done();
      });
  });
});
