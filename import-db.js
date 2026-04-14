const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'sh-cynosdbmysql-grp-0cnhvnei.sql.tencentcdb.com',
    port: 27704,
    user: 'root',
    password: 'xn5xEvGp',
    multipleStatements: true
  });
  
  console.log("Connected to MySQL server!");
  
  await connection.query("CREATE DATABASE IF NOT EXISTS love_wall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  console.log("Created/Ensured database love_wall exists.");
  
  await connection.query("USE love_wall;");
  
  const sql = fs.readFileSync('legacy_laravel/love_wall.sql', 'utf8');
  console.log("Read legacy SQL dump. Executing...");
  
  await connection.query(sql);
  console.log("Imported successfully!");
  
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
