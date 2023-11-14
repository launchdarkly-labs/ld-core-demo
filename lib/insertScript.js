const { Pool } = require('pg');
const creditData = [
    {
        "date": "2023-01-03",
        "merchant": "Pharmacy",
        "amount": 265.73,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-17",
        "merchant": "GasStation",
        "amount": 83.59,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-05-01",
        "merchant": "Restaurant",
        "amount": 33.91,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-18",
        "merchant": "Pharmacy",
        "amount": 153.54,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-07-11",
        "merchant": "TechStore",
        "amount": 26.06,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-05-26",
        "merchant": "OnlineMarket",
        "amount": 219.07,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-17",
        "merchant": "ClothingStore",
        "amount": 138.04,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-03-22",
        "merchant": "Pharmacy",
        "amount": 173.14,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-05-04",
        "merchant": "SuperMarket",
        "amount": 256.92,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-03-10",
        "merchant": "BookStore",
        "amount": 16.19,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-09-01",
        "merchant": "OnlineMarket",
        "amount": 216.65,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-03-17",
        "merchant": "ClothingStore",
        "amount": 129.0,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-07-14",
        "merchant": "TechStore",
        "amount": 170.63,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-30",
        "merchant": "GasStation",
        "amount": 244.86,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-09-01",
        "merchant": "BookStore",
        "amount": 46.33,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-04-04",
        "merchant": "Pharmacy",
        "amount": 278.76,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-02-21",
        "merchant": "OnlineMarket",
        "amount": 330.84,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-09",
        "merchant": "Pharmacy",
        "amount": 440.15,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-11-08",
        "merchant": "SuperMarket",
        "amount": 387.71,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-04-30",
        "merchant": "TechStore",
        "amount": 170.61,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-14",
        "merchant": "TechStore",
        "amount": 462.69,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-09-10",
        "merchant": "CoffeeShop",
        "amount": 52.44,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-22",
        "merchant": "Pharmacy",
        "amount": 407.7,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-11-04",
        "merchant": "SuperMarket",
        "amount": 297.67,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-02-24",
        "merchant": "SuperMarket",
        "amount": 147.75,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-03-11",
        "merchant": "CoffeeShop",
        "amount": 54.86,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-09-30",
        "merchant": "TechStore",
        "amount": 38.35,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-21",
        "merchant": "PetShop",
        "amount": 312.34,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-07-08",
        "merchant": "GasStation",
        "amount": 237.96,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-31",
        "merchant": "PetShop",
        "amount": 61.42,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-01-02",
        "merchant": "Pharmacy",
        "amount": 168.49,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-03-10",
        "merchant": "PetShop",
        "amount": 138.01,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-04-27",
        "merchant": "OnlineMarket",
        "amount": 203.75,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-25",
        "merchant": "TechStore",
        "amount": 377.84,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-21",
        "merchant": "OnlineMarket",
        "amount": 151.89,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-04-01",
        "merchant": "Restaurant",
        "amount": 28.89,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-07-29",
        "merchant": "Restaurant",
        "amount": 35.06,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-08-21",
        "merchant": "PetShop",
        "amount": 45.75,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-04-16",
        "merchant": "Restaurant",
        "amount": 423.89,
        "status": "successful",
        "accounttype": "credit",
        "user": "Default"
    },
    {
        "date": "2023-10-11",
        "merchant": "GasStation",
        "amount": 386.65,
        "status": "pending",
        "accounttype": "credit",
        "user": "Default"
    }
];

// PostgreSQL connection string
const connectionString = '***REMOVED***';

const pool = new Pool({
    connectionString: connectionString,
});

async function insertData() {
    try {
        await pool.connect(); // Connect to the database

        // Assuming your table is named 'transactions'
        const queryText = `INSERT INTO transactions(date, merchant, amount, status, accounttype, "user") VALUES($1, $2, $3, $4, $5, $6)`;

        for (let item of creditData) {
            const values = [item.date, item.merchant, item.amount, item.status, item.accounttype, item.user];
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
