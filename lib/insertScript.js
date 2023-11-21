const { Pool } = require("pg");
const storeData = [
  {
    id: 21,
    item: "VR Headset - Advanced Model",
    cost: 499.99,
    vendor: "boominbox",
  },
  {
    id: 22,
    item: "Bluetooth Noise-Canceling Headphones",
    cost: 299.99,
    vendor: "boominbox",
  },
  {
    id: 23,
    item: "Wireless Earbuds - Waterproof Edition",
    cost: 159.99,
    vendor: "boominbox",
  },
  {
    id: 24,
    item: "High-Fidelity Turntable",
    cost: 349.99,
    vendor: "boominbox",
  },
  {
    id: 25,
    item: "Portable Bluetooth Speaker - Rugged Design",
    cost: 119.99,
    vendor: "boominbox",
  },
  {
    id: 26,
    item: "Studio Monitor Speakers (Pair)",
    cost: 499.99,
    vendor: "boominbox",
  },
  {
    id: 27,
    item: "Multi-Channel Home Theater System",
    cost: 999.99,
    vendor: "boominbox",
  },
  {
    id: 28,
    item: "Digital Audio Interface - Pro Series",
    cost: 229.99,
    vendor: "boominbox",
  },
  {
    id: 29,
    item: "Smart Home Sound System with Voice Control",
    cost: 399.99,
    vendor: "boominbox",
  },
  { id: 30, item: "Professional DJ Mixer", cost: 699.99, vendor: "boominbox" },
];

// PostgreSQL connection string
const connectionString =
  "postgresql://postgres:LDD3v3xp@fielddemodb.cii3vie7naoe.us-west-2.rds.amazonaws.com:5432";

const pool = new Pool({
  connectionString: connectionString,
});

async function insertData() {
  try {
    await pool.connect(); // Connect to the database

    // Assuming your table is named 'macrocenterstore'
    const queryText = `INSERT INTO galaxymarketplace(id, item, cost, vendor) VALUES($1, $2, $3, $4)`;

    for (let item of storeData) {
      const values = [item.id, item.item, item.cost, item.vendor];
      await pool.query(queryText, values);
    }

    console.log("Data inserted successfully.");
  } catch (err) {
    console.error("Error inserting data", err);
  } finally {
    await pool.end(); // Close the database connection
  }
}

insertData();
