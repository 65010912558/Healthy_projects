const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "pooHLK123",
    database: "database"
});

// ฟังก์ชันดึงข้อมูลจาก PostgreSQL
const getData = async () => {
    try {
        await client.connect(); // เชื่อมต่อกับฐานข้อมูล
        const res = await client.query('SELECT * FROM users');
        console.log(res.rows); // แสดงข้อมูลใน console
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end(); // ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
    }
};

// เรียกใช้งานฟังก์ชัน
getData();
