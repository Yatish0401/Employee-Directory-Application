// createSuperAdmin.js
// Run this script once to create your first super admin user
// Usage: node createSuperAdmin.js

const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin",
  database: "login",
  port: 3306,
  acquireTimeout: 60000,
  timeout: 60000,
});

function createFirstSuperAdmin() {
  const superAdminData = {
    name: "Super Administrator",
    email: "admin@yourcompany.com", // Change this to your desired email
    phone: "1234567890", // Change this to your phone
    password: "Admin@123", // Change this to your desired password
    role: "superadmin"
  };

  console.log("🔧 Creating first super admin user...");
  console.log(`📧 Email: ${superAdminData.email}`);
  console.log(`📱 Phone: ${superAdminData.phone}`);
  console.log(`🔐 Password: ${superAdminData.password}`);
  console.log("⚠️  Please change these credentials after first login!\n");

  // Check if super admin already exists
  const checkSql = "SELECT * FROM usersTest WHERE role = 'superadmin' LIMIT 1";
  
  db.query(checkSql, (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      db.end();
      process.exit(1);
    }

    if (result.length > 0) {
      console.log("✅ Super admin already exists!");
      console.log("Existing super admin:");
      const admin = result[0];
      console.log(`   - ${admin.name} (${admin.email}) - ID: ${admin.id}`);
      db.end();
      return;
    }

    // Check if email already exists
    const checkEmailSql = "SELECT * FROM usersTest WHERE email = ?";
    db.query(checkEmailSql, [superAdminData.email], (err, emailResult) => {
      if (err) {
        console.error("❌ Database error:", err);
        db.end();
        process.exit(1);
      }

      if (emailResult.length > 0) {
        console.log("❌ Email already exists!");
        console.log(`   Email: ${superAdminData.email}`);
        db.end();
        process.exit(1);
      }

      // Hash password and create super admin
      bcrypt.hash(superAdminData.password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("❌ Password hashing error:", hashErr);
          db.end();
          process.exit(1);
        }

        const insertSql = "INSERT INTO usersTest (name, email, phone, password, role, permissions) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(insertSql, [
          superAdminData.name,
          superAdminData.email,
          superAdminData.phone,
          hashedPassword,
          superAdminData.role,
          JSON.stringify([]) // Empty permissions array
        ], (err, result) => {
          if (err) {
            console.error("❌ Failed to create super admin:", err);
            db.end();
            process.exit(1);
          }

          const userId = result.insertId;
          
          // Create default profile for super admin
          const createProfileSql = "INSERT INTO user_profiles_test (user_id, name, email, phone, role, permissions) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(createProfileSql, [
            userId,
            superAdminData.name,
            superAdminData.email,
            superAdminData.phone,
            superAdminData.role,
            JSON.stringify([])
          ], (profileErr) => {
            if (profileErr) {
              console.warn("⚠️  Warning: Super admin created but profile creation failed:", profileErr.message);
            } else {
              console.log("✅ Default profile created for super admin");
            }

            console.log("\n🎉 Super admin created successfully!\n");
            console.log("═══════════════════════════════════════");
            console.log(`📋 User ID: ${userId}`);
            console.log(`👤 Name: ${superAdminData.name}`);
            console.log(`📧 Email: ${superAdminData.email}`);
            console.log(`📱 Phone: ${superAdminData.phone}`);
            console.log(`🛡️  Role: ${superAdminData.role}`);
            console.log("═══════════════════════════════════════\n");
            console.log("🔗 Login at: https://localhost:3000/superadmin-login");
            console.log("⚠️  Change the default password after first login!\n");
            
            db.end();
          });
        });
      });
    });
  });
}

// Connect to database and create super admin
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    console.error("   Make sure MySQL is running and credentials are correct");
    process.exit(1);
  }
  
  console.log("✅ Connected to MySQL database\n");
  createFirstSuperAdmin();
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Process interrupted. Closing database connection...');
  db.end();
  process.exit(0);
});