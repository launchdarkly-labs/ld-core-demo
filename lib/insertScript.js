const { Pool } = require('pg');
const storeData = [
    {"id": 1, "item": "VR Headset - Advanced Model", "cost": 499.99, "vendor": "vrgalaxy"},
    {"id": 2, "item": "Wireless VR Controllers (Pair)", "cost": 119.99, "vendor": "vrgalaxy"},
    {"id": 3, "item": "VR Treadmill for Immersive Movement", "cost": 899.99, "vendor": "vrgalaxy"},
    {"id": 4, "item": "Haptic Feedback Gloves", "cost": 259.99, "vendor": "vrgalaxy"},
    {"id": 5, "item": "Virtual Reality Game - Space Adventure", "cost": 59.99, "vendor": "vrgalaxy"},
    {"id": 6, "item": "VR Headset Cleaning Kit", "cost": 29.99, "vendor": "vrgalaxy"},
    {"id": 7, "item": "360° VR Camera", "cost": 349.99, "vendor": "vrgalaxy"},
    {"id": 8, "item": "Virtual Reality Development Software", "cost": 199.99, "vendor": "vrgalaxy"},
    {"id": 9, "item": "Adjustable VR Headset Stand", "cost": 39.99, "vendor": "vrgalaxy"},
    {"id": 10, "item": "Virtual Reality Experience Ticket - Underwater World", "cost": 14.99, "vendor": "vrgalaxy"},
    {"id": 11, "item": "High-Performance Graphics Card - 8GB", "cost": 699.99, "vendor": "macrocenter"},
    {"id": 12, "item": "Gaming Motherboard - RGB Lighting", "cost": 259.99, "vendor": "macrocenter"},
    {"id": 13, "item": "Solid State Drive (SSD) - 1TB", "cost": 129.99, "vendor": "macrocenter"},
    {"id": 14, "item": "DDR4 RAM - 16GB Kit (2x8GB)", "cost": 89.99, "vendor": "macrocenter"},
    {"id": 15, "item": "Modular Power Supply - 750W", "cost": 119.99, "vendor": "macrocenter"},
    {"id": 16, "item": "CPU Cooler - Liquid Cooling System", "cost": 139.99, "vendor": "macrocenter"},
    {"id": 17, "item": "Full-Tower PC Case - Tempered Glass", "cost": 199.99, "vendor": "macrocenter"},
    {"id": 18, "item": "Wireless Gaming Keyboard and Mouse Combo", "cost": 99.99, "vendor": "macrocenter"},
    {"id": 19, "item": "27-inch Gaming Monitor - 144Hz", "cost": 329.99, "vendor": "macrocenter"},
    {"id": 20, "item": "Internal Sound Card - 7.1 Surround", "cost": 79.99, "vendor": "macrocenter"}
]


// PostgreSQL connection string
const connectionString = 'postgresql://postgres:LDD3v3xp@fielddemodb.cii3vie7naoe.us-west-2.rds.amazonaws.com:5432';

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

        console.log('Data inserted successfully.');
    } catch (err) {
        console.error('Error inserting data', err);
    } finally {
        await pool.end(); // Close the database connection
    }
}

insertData();
