
const express = require('express');
const { Client } = require('pg');


const app = express();

const dbConfig = {
    host: 'dpg-cs62pr88fa8c73aslnk0-a',            
    user: 'root',         
    database: 'one_qr26',  
    password: 'PntsJjvJWrEanI1wYFzMy2uI5UG44yQi',      
    port: 5432,               
};


const client = new Client(dbConfig);


client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database successfully!');
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });


app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM goals');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/activities', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM activities');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
process.on('exit', () => {
    client.end();
});