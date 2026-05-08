// fixDatabase.js - Simple script to add missing columns
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin",
  database: "login",
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected\n");

  // Step 1: Add role column
  console.log("⏳ Adding role column...");
  db.query(`ALTER TABLE user_profiles_test ADD COLUMN role VARCHAR(50) DEFAULT 'user'`, (err) => {
    if (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("✅ role column already exists");
      } else {
        console.error("❌ Error:", err.message);
      }
    } else {
      console.log("✅ role column added");
    }

    // Step 2: Add permissions column
    console.log("⏳ Adding permissions column...");
    db.query(`ALTER TABLE user_profiles_test ADD COLUMN permissions LONGTEXT`, (err) => {
      if (err) {
        if (err.code === "ER_DUP_FIELDNAME") {
          console.log("✅ permissions column already exists");
        } else {
          console.error("❌ Error:", err.message);
        }
      } else {
        console.log("✅ permissions column added");
      }

      // Verify
      console.log("\n📋 Verifying table structure...");
      db.query("DESCRIBE user_profiles_test", (err, result) => {
        if (err) {
          console.error("Error:", err);
        } else {
          console.log("\nColumns in user_profiles_test:");
          result.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
          });
        }
        console.log("\n✅ Done! Restart your server now.\n");
        db.end();
      });
    });
  });
});