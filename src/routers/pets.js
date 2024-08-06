const router = require("express").Router();

module.exports = function (pool) {
  // GET all pets
  router.get("/", async function (req, res) {
    const client = await pool.connect();
    try {
      const response = await client.query("SELECT * FROM pets");
      const pets = response.rows;
      res.json({ pets: pets });
    } catch (error) {
      console.error("Error fetching pets: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release();
    }
  });

  // GET a pet by ID
  router.get("/:id", async function (req, res) {
    const client = await pool.connect();
    const { id } = req.params;
    try {
      const response = await client.query("SELECT * FROM pets WHERE id = $1", [
        id,
      ]);
      const pet = response.rows[0];
      if (pet) {
        res.json({ pet: pet });
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } catch (error) {
      console.error("Error fetching pet by ID: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release();
    }
  });

  // POST a new pet
  router.post("/", async function (req, res) {
    const client = await pool.connect();
    const { name, type, age, owner } = req.body;
    try {
      const response = await client.query(
        "INSERT INTO pets (name, type, age, owner) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, type, age, owner]
      );
      const newPet = response.rows[0];
      res.status(201).json({ pet: newPet });
    } catch (error) {
      console.error("Error creating a new pet: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release();
    }
  });

  // PUT update an existing pet by ID
  router.put("/:id", async function (req, res) {
    const client = await pool.connect();
    const { id } = req.params;
    const { name, type, age, owner } = req.body;
    try {
      const response = await client.query(
        "UPDATE pets SET name = $1, type = $2, age = $3, owner = $4 WHERE id = $5 RETURNING *",
        [name, type, age, owner, id]
      );
      const updatedPet = response.rows[0];
      if (updatedPet) {
        res.json({ pet: updatedPet });
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } catch (error) {
      console.error("Error updating pet: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release();
    }
  });

  // DELETE a pet by ID
  router.delete("/:id", async function (req, res) {
    const client = await pool.connect();
    const { id } = req.params;
    try {
      const response = await client.query(
        "DELETE FROM pets WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedPet = response.rows[0];
      if (deletedPet) {
        res.json({ pet: deletedPet });
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } catch (error) {
      console.error("Error deleting pet: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      client.release();
    }
  });

  return router;
};
