
const express = require('express');
const { Client } = require('pg');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

const dbConfig = {
    host: 'dpg-cs62pr88fa8c73aslnk0-a',
    user: 'root',
    database: 'one_qr26',
    password: 'PntsJjvJWrEanI1wYFzMy2uI5UG44yQi',
    port: port,
};


const client = new Client(dbConfig);


client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database successfully!');
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM public.goals ORDER BY id ASC');
        res.json(result.rows); // ส่งข้อมูลเป็น JSON
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันเพิ่มเป้าหมายใหม่
app.post('/api/goals', async (req, res) => {
    const { user_id, goal } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('INSERT INTO goals (user_id, goal, created_at) VALUES ($1, $2,NOW()) RETURNING *', [user_id, goal]);
        res.status(201).json(result.rows[0]); // ส่งข้อมูลเป้าหมายที่ถูกสร้างขึ้นใหม่
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันแก้ไขเป้าหมาย
app.put('/api/goals/:id', async (req, res) => {
    const goalId = req.params.id; // ดึง id จาก params
    const { goal } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('UPDATE goals SET goal = $1  WHERE id = $2 RETURNING *', [goal, goalId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Goal not found');
        }
        res.json(result.rows[0]); // ส่งข้อมูลเป้าหมายที่ถูกแก้ไข
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันลบเป้าหมาย
app.delete('/api/goals/:id', async (req, res) => {
    const goalId = req.params.id; // ดึง id จาก params
    try {
        const result = await client.query('DELETE FROM goals WHERE id = $1 RETURNING *', [goalId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Goal not found');
        }
        res.status(204).send(); // ส่งสถานะ 204 No Content
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันค้นหาข้อมูลเป้าหมายโดย user_id
app.get('/api/goals/user/:user_id', async (req, res) => {
    const userId = req.params.user_id; // ดึง user_id จาก params
    try {
        const result = await client.query('SELECT * FROM goals WHERE user_id = $1', [userId]);
        res.json(result.rows); // ส่งข้อมูลเป็น JSON
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก health_records
app.get('/api/health-records', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM health_records');
        res.json(result.rows); // ส่งข้อมูลเป็น JSON
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันเพิ่มข้อมูลสุขภาพใหม่
app.post('/api/health-records', async (req, res) => {
    const { user_id, weight, height, blood_pressure } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('INSERT INTO health_records (user_id, weight, height, blood_pressure, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *', [user_id, weight, height, blood_pressure]);
        res.status(201).json(result.rows[0]); // ส่งข้อมูลสุขภาพที่ถูกสร้างขึ้นใหม่
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันแก้ไขข้อมูลสุขภาพ
app.put('/api/health-records/:id', async (req, res) => {
    const recordId = req.params.id; // ดึง id จาก params
    const { weight, height, blood_pressure } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('UPDATE health_records SET weight = $1, height = $2, blood_pressure = $3, created_at = NOW(), WHERE id = $4 RETURNING *', [weight, height, blood_pressure, recordId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Health record not found');
        }
        res.json(result.rows[0]); // ส่งข้อมูลสุขภาพที่ถูกแก้ไข
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันลบข้อมูลสุขภาพ
app.delete('/api/health-records/:id', async (req, res) => {
    const recordId = req.params.id; // ดึง id จาก params
    try {
        const result = await client.query('DELETE FROM health_records WHERE id = $1 RETURNING *', [recordId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Health record not found');
        }
        res.status(204).send(); // ส่งสถานะ 204 No Content
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก activities
app.get('/api/activities', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM activities');
        res.json(result.rows); // ส่งข้อมูลเป็น JSON
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันเพิ่มกิจกรรมใหม่
app.post('/api/activities', async (req, res) => {
    const { user_id, activity, duration } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query(
            'INSERT INTO activities (user_id, activity, duration, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [user_id, activity, duration]
        );
        res.status(201).json(result.rows[0]); // ส่งข้อมูลกิจกรรมที่ถูกสร้างขึ้นใหม่
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});


// ฟังก์ชันแก้ไขกิจกรรม
app.put('/api/activities/:id', async (req, res) => {
    const activityId = req.params.id; // ดึง id จาก params
    const { activity, duration } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('UPDATE activities SET activity = $1, duration = $2, created_at = NOW(), $3 WHERE id = $4 RETURNING *', [activity, duration, activityId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Activity not found');
        }
        res.json(result.rows[0]); // ส่งข้อมูลกิจกรรมที่ถูกแก้ไข
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันลบกิจกรรม
app.delete('/api/activities/:id', async (req, res) => {
    const activityId = req.params.id; // ดึง id จาก params
    try {
        const result = await client.query('DELETE FROM activities WHERE id = $1 RETURNING *', [activityId]);
        if (result.rows.length === 0) {
            return res.status(404).send('Activity not found');
        }
        res.status(204).send(); // ส่งสถานะ 204 No Content
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก users
app.get('/api/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows); // ส่งข้อมูลเป็น JSON
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันเพิ่มผู้ใช้ใหม่
app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body; // ดึงข้อมูลจาก request body
    console.log("Received data:", req.body);
    try {
        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1,$2, $3) RETURNING *', [name, email, password]);
        res.status(201).json(result.rows[0]); // ส่งข้อมูลผู้ใช้ที่ถูกสร้างขึ้นใหม่
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันแก้ไขข้อมูลผู้ใช้
app.put('/api/users/:id', async (req, res) => {
    const userId = req.params.id; // ดึง id จาก params
    const { name, email, password } = req.body; // ดึงข้อมูลจาก request body
    try {
        const result = await client.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *', [name, email, password, userId]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(result.rows[0]); // ส่งข้อมูลผู้ใช้ที่ถูกแก้ไข
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

// ฟังก์ชันลบผู้ใช้
app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id; // ดึง id จาก params
    try {
        const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).send(); // ส่งสถานะ 204 No Content
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

