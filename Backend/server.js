require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./captcha.env" });
const axios = require("axios");

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(
  cors({
    origin: "https://employee-directory-application-tan.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS
  },
  tls: {
    rejectUnauthorized: false  // ✅ Render pe TLS issue fix karta hai
  }
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "viaduct.proxy.rlwy.net",
  user: "root",
  password: "LdwhcjJoDvqQLkVuPZECVKsRNskqBkuC",
  database: "railway",
  port: 43956,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database 'login'");
  connection.release();
  createTables();
});

function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS usersTest (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(50) UNIQUE,
      email VARCHAR(191) UNIQUE NOT NULL,
      phone VARCHAR(15),
      otp VARCHAR(6),
      otp_created_at DATETIME,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'USER',
      permissions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `;

  const createProfilesTable = `
    CREATE TABLE IF NOT EXISTS user_profiles_test (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      parent_id INT NULL,
      creator_user_id INT NULL,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(50),
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(50) DEFAULT 'USER',
      permissions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_parent_id (parent_id),
      INDEX idx_creator_user_id (creator_user_id),
      INDEX idx_username (username),
      CONSTRAINT fk_user_profiles_user_id FOREIGN KEY (user_id) REFERENCES usersTest(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `;

  const createRolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(191) NOT NULL UNIQUE,
      permissions TEXT NOT NULL,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT NULL,
      FOREIGN KEY (created_by) REFERENCES usersTest(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `;

  pool.query(createUsersTable, (err) => {
    if (err) {
      console.error("❌ Error creating users table:", err.message);
    } else {
      console.log("✅ Users table ready");
      pool.query(createProfilesTable, (err) => {
        if (err) {
          console.error("❌ Error creating profiles table:", err.message);
        } else {
          console.log("✅ User profiles table ready");
          pool.query(createRolesTable, (err) => {
            if (err) {
              console.error("❌ Error creating roles table:", err.message);
            } else {
              console.log("✅ Roles table ready");
              createOrderTables(); 
            }
          });
        }
      });
    }
  });
}


function createOrderTables() {
  const tables = [
    {
      name: 'itar_orders',
      sql: `CREATE TABLE IF NOT EXISTS itar_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_date DATE,
        est_no VARCHAR(100),
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        special_request TEXT,
        qty INT,
        serial_number VARCHAR(150),
        location VARCHAR(200),
        itar_no VARCHAR(100),
        ship_date DATE,
        invoice_no VARCHAR(100),
        order_status VARCHAR(50),
        username VARCHAR(50),
        created_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL,
        INDEX idx_itar_username (username),
        INDEX idx_itar_created_by (created_by_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'hardware_orders',
      sql: `CREATE TABLE IF NOT EXISTS hardware_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_date DATE,
        est_no VARCHAR(100),
        assigned_username VARCHAR(50),
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        location VARCHAR(200),
        hardware_no VARCHAR(100),
        ship_date DATE,
        invoice_no VARCHAR(100),
        order_status VARCHAR(50),
        created_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL,
        INDEX idx_hw_username (assigned_username),
        INDEX idx_hw_created_by (created_by_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'av_pos_orders',
      sql: `CREATE TABLE IF NOT EXISTS av_pos_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_date DATE,
        est_no VARCHAR(100),
        product_type VARCHAR(100),
        assigned_username VARCHAR(50),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        location VARCHAR(200),
        av_pos_no VARCHAR(100),
        ship_date DATE,
        invoice_no VARCHAR(100),
        order_status VARCHAR(50),
        sow TEXT,
        created_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL,
        INDEX idx_av_username (assigned_username),
        INDEX idx_av_created_by (created_by_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'hardware_software_pos',
      sql: `CREATE TABLE IF NOT EXISTS hardware_software_pos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_date DATE,
        est_no VARCHAR(100),
        product_type VARCHAR(100),
        assigned_username VARCHAR(50),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        location VARCHAR(200),
        po_no VARCHAR(100),
        ship_date DATE,
        invoice_no VARCHAR(100),
        order_status VARCHAR(50),
        created_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL,
        INDEX idx_hwsw_username (assigned_username),
        INDEX idx_hwsw_created_by (created_by_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    }
  ];
 
  // ── 4 inline-item tables (separate FK tables, no JSON column) ──
  const inlineTables = [
    {
      name: 'itar_order_inline',
      sql: `CREATE TABLE IF NOT EXISTS itar_order_inline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        itar_order_id INT NOT NULL,
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        special_request TEXT,
        qty INT,
        serial_number VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_itar_inline FOREIGN KEY (itar_order_id)
          REFERENCES itar_orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'hardware_order_inline',
      sql: `CREATE TABLE IF NOT EXISTS hardware_order_inline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hardware_order_id INT NOT NULL,
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_hardware_inline FOREIGN KEY (hardware_order_id)
          REFERENCES hardware_orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'av_pos_order_inline',
      sql: `CREATE TABLE IF NOT EXISTS av_pos_order_inline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        av_pos_order_id INT NOT NULL,
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_av_pos_inline FOREIGN KEY (av_pos_order_id)
          REFERENCES av_pos_orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    },
    {
      name: 'hardware_software_pos_inline',
      sql: `CREATE TABLE IF NOT EXISTS hardware_software_pos_inline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hw_sw_pos_id INT NOT NULL,
        product_type VARCHAR(100),
        manufacturer_name VARCHAR(150),
        part_number VARCHAR(150),
        qty INT,
        serial_number VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_hw_sw_pos_inline FOREIGN KEY (hw_sw_pos_id)
          REFERENCES hardware_software_pos(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    }
  ];
 
  // Create main order tables first
  tables.forEach(({ name, sql }) => {
    pool.query(sql, (err) => {
      if (err) {
        console.error(`❌ Error creating ${name}:`, err.message);
      } else {
        console.log(`✅ ${name} table ready`);
 
        // Add special_request column to itar_orders if missing
        if (name === 'itar_orders') {
          pool.query(
            `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'itar_orders' AND COLUMN_NAME = 'special_request'`,
            (checkErr, checkResult) => {
              if (!checkErr && checkResult[0].cnt === 0) {
                pool.query(`ALTER TABLE itar_orders ADD COLUMN special_request TEXT NULL`, (addErr) => {
                  if (addErr) console.error(`⚠️ Could not add special_request:`, addErr.message);
                  else console.log(`✅ special_request column added to itar_orders`);
                });
              }
            }
          );
        }
 
        // Add updated_at column if missing
        pool.query(
          `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'updated_at'`,
          [name],
          (checkErr, checkResult) => {
            if (!checkErr && checkResult[0].cnt === 0) {
              pool.query(`ALTER TABLE ${name} ADD COLUMN updated_at DATETIME DEFAULT NULL`, (addErr) => {
                if (addErr) console.error(`⚠️ Could not add updated_at to ${name}:`, addErr.message);
                else console.log(`✅ updated_at added to ${name}`);
              });
            }
          }
        );
      }
    });
  });
 
  // Create inline item tables after a short delay (ensures parent tables exist)
  setTimeout(() => {
    inlineTables.forEach(({ name, sql }) => {
      pool.query(sql, (err) => {
        if (err) {
          console.error(`❌ Error creating ${name}:`, err.message);
        } else {
          console.log(`✅ ${name} inline table ready`);
        }
      });
    });
    createMissingTables();
  }, 1000);
}
 
// Add this before the setTimeout in createOrderTables()
pool.query(`CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_type VARCHAR(100),
  part_number VARCHAR(150),
  manufacturer_name VARCHAR(150),
  product_description TEXT,
  extra_details TEXT,
  product_image LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
  if (err) console.error('❌ Error creating products table:', err.message);
  else console.log('✅ products table ready');
});


// ============================================================
// USER ACTIVITY TABLE + ROUTES
// ============================================================
pool.query(`CREATE TABLE IF NOT EXISTS user_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(100),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
  if (err) console.error('❌ user_activity table error:', err.message);
  else console.log('✅ user_activity table ready');
});

// Log activity

function createMissingTables() {

  // 1. manufacturers
  pool.query(`CREATE TABLE IF NOT EXISTS manufacturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ manufacturers:', err.message);
    else console.log('✅ manufacturers table ready');
  });

  // 2. hardware_warranty
  pool.query(`CREATE TABLE IF NOT EXISTS hardware_warranty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hardware_order_id INT,
    hardware_order_inline_id INT,
    serial_number VARCHAR(150),
    product_name VARCHAR(255),
    purchase_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL,
    INDEX idx_hw_order (hardware_order_id),
    INDEX idx_hw_inline (hardware_order_inline_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ hardware_warranty:', err.message);
    else console.log('✅ hardware_warranty table ready');
  });

  // 3. order_pod_files  (used by ITAR orders)
  pool.query(`CREATE TABLE IF NOT EXISTS order_pod_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_type VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_opf_order (order_id, order_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ order_pod_files:', err.message);
    else console.log('✅ order_pod_files table ready');
  });

  // 4. hardware_pod_files
  pool.query(`CREATE TABLE IF NOT EXISTS hardware_pod_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_type VARCHAR(50) DEFAULT 'hardware',
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hpf_order (order_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ hardware_pod_files:', err.message);
    else console.log('✅ hardware_pod_files table ready');
  });

  // 5. av_pos_pod_files
  pool.query(`CREATE TABLE IF NOT EXISTS av_pos_pod_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    av_pos_order_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_avpf_order (av_pos_order_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ av_pos_pod_files:', err.message);
    else console.log('✅ av_pos_pod_files table ready');
  });

  // 6. hwswpos_pod_files
  pool.query(`CREATE TABLE IF NOT EXISTS hwswpos_pod_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hwswpf_order (order_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ hwswpos_pod_files:', err.message);
    else console.log('✅ hwswpos_pod_files table ready');
  });

  // 7. tickets
  pool.query(`CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    order_type VARCHAR(50),
    line_no INT,
    item_id INT,
    email VARCHAR(191),
    comment TEXT,
    image_path VARCHAR(255),
    image_filename VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_order (order_id, order_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`, (err) => {
    if (err) console.error('❌ tickets:', err.message);
    else console.log('✅ tickets table ready');
  });
}


// hardware_orders ke baad
const extraColumns = [
  { table: 'hardware_orders',       col: 'remark',          type: 'TEXT NULL' },
  { table: 'hardware_orders',       col: 'special_request', type: 'TEXT NULL' },
  { table: 'av_pos_orders',         col: 'remark',          type: 'TEXT NULL' },
  { table: 'av_pos_orders',         col: 'special_request', type: 'TEXT NULL' },
  { table: 'hardware_software_pos', col: 'remark',          type: 'TEXT NULL' },
  { table: 'hardware_software_pos', col: 'special_request', type: 'TEXT NULL' },
  { table: 'itar_orders',           col: 'remark',          type: 'TEXT NULL' },
];

extraColumns.forEach(({ table, col, type }) => {
  pool.query(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, col],
    (err, result) => {
      if (!err && result[0].cnt === 0) {
        pool.query(
          `ALTER TABLE ${table} ADD COLUMN ${col} ${type}`,
          (addErr) => {
            if (addErr) console.error(`⚠️ Could not add ${col} to ${table}:`, addErr.message);
            else console.log(`✅ ${col} added to ${table}`);
          }
        );
      }
    }
  );
});

app.post('/activity', (req, res) => {
  const { userId, userName, action, module, details } = req.body;
  console.log("📌 Activity received:", req.body);

  if (!userId || !action) {
    return res.status(400).json({ error: "userId and action are required" });
  }

  const sql = `INSERT INTO user_activity (user_id, user_name, action, module, details)
               VALUES (?, ?, ?, ?, ?)`;

  pool.query(sql, [userId, userName, action, module, details], (err, result) => {
    if (err) {
      console.error("❌ DB Activity Error:", err.sqlMessage);
      return res.status(500).json({ error: "Failed to log activity" });
    }
    console.log("✅ Activity saved, ID:", result.insertId);
    res.json({ message: "Activity logged", id: result.insertId });
  });
});


// Auto-delete activity logs older than 60 days
app.delete('/activity/cleanup', (req, res) => {
  pool.query(
    `DELETE FROM user_activity WHERE created_at < DATE_SUB(NOW(), INTERVAL 60 DAY)`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: result.affectedRows, message: `${result.affectedRows} old logs deleted` });
    }
  );
});

// Auto-cleanup on server start (har baar server start hone par)
pool.query(
  `DELETE FROM user_activity WHERE created_at < DATE_SUB(NOW(), INTERVAL 60 DAY)`,
  (err, result) => {
    if (err) console.error('❌ Activity cleanup error:', err.message);
    else console.log(`✅ Activity cleanup: ${result.affectedRows} old logs deleted`);
  }
);

// Fetch current user ki activity
app.get('/activity', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  
  pool.query(
    `SELECT * FROM user_activity 
     WHERE user_id = ? 
     ORDER BY id DESC    
     LIMIT 500`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const rowsWithSeq = rows.map((row, index) => ({
        ...row,
        performedBy: row.user_name,
        sequenceNo: index + 1
      }));
      
      res.json(rowsWithSeq);
    }
  );
});
 
// ============================================================
// HELPER: save inline items to the correct table
// ============================================================
 
function saveInlineItems(connection, tableName, fkColumn, parentId, items, callback) {
  // Delete existing items for this order first
  connection.query(`DELETE FROM ${tableName} WHERE ${fkColumn} = ?`, [parentId], (delErr) => {
    if (delErr) return callback(delErr);
    if (!items || items.length === 0) return callback(null);
 
    const validItems = items.filter(item =>
      item.productType || item.manufacturerName || item.partNumber
    );
    if (validItems.length === 0) return callback(null);
 
    // Build bulk insert
    let sql, values;
 
    if (tableName === 'itar_order_inline') {
      sql = `INSERT INTO itar_order_inline
               (itar_order_id, product_type, manufacturer_name, part_number, special_request, qty, serial_number)
             VALUES ?`;
      values = validItems.map(item => [
        parentId,
        item.productType || null,
        item.manufacturerName || null,
        item.partNumber || null,
        item.specialRequest || null,
        item.qty || null,
        item.serialNumber || null
      ]);
    } else {
      // hardware_order_inline / av_pos_order_inline / hardware_software_pos_inline
      const colMap = {
        hardware_order_inline:         'hardware_order_id',
        av_pos_order_inline:           'av_pos_order_id',
        hardware_software_pos_inline:  'hw_sw_pos_id'
      };
      const fk = colMap[tableName] || fkColumn;
      sql = `INSERT INTO ${tableName}
               (${fk}, product_type, manufacturer_name, part_number, qty, serial_number)
             VALUES ?`;
      values = validItems.map(item => [
        parentId,
        item.productType || null,
        item.manufacturerName || null,
        item.partNumber || null,
        item.qty || null,
        item.serialNumber || null
      ]);
    }
 
    connection.query(sql, [values], (insErr) => {
      if (insErr) return callback(insErr);
      callback(null);
    });
  });
}
 
 
// ============================================================
// HELPER: fetch inline items for an order
// ============================================================
 
function fetchInlineItems(tableName, fkColumn, parentId, callback) {
  pool.query(
    `SELECT * FROM ${tableName} WHERE ${fkColumn} = ? ORDER BY id ASC`,
    [parentId],
    (err, rows) => {
      if (err) return callback(err, []);
      // Normalise keys to camelCase so frontend stays unchanged
      const normalised = rows.map(r => ({
        id:               r.id,
        productType:      r.product_type,
        manufacturerName: r.manufacturer_name,
        partNumber:       r.part_number,
        specialRequest:   r.special_request || null,
        qty:              r.qty,
        serialNumber:     r.serial_number
      }));
      callback(null, normalised);
    }
  );
}

// ========== HELPER: RESOLVE ROLE ==========
async function resolveRole(roleInput) {
  if (!roleInput) return { roleName: "USER", permissions: [] };

  const roleId = parseInt(roleInput);
  if (!isNaN(roleId)) {
    try {
      const roleData = await new Promise((resolve, reject) => {
        pool.query("SELECT role_name, permissions FROM roles WHERE id = ?", [roleId], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
      if (roleData.length > 0) {
        return {
          roleName: roleData[0].role_name.toUpperCase(),
          permissions: typeof roleData[0].permissions === 'string'
            ? JSON.parse(roleData[0].permissions)
            : roleData[0].permissions
        };
      }
    } catch (error) {
      console.error("❌ Error fetching role by ID:", error);
    }
  }

  if (typeof roleInput === 'string') {
    try {
      const roleData = await new Promise((resolve, reject) => {
        pool.query("SELECT permissions FROM roles WHERE UPPER(role_name) = UPPER(?)", [roleInput], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
      if (roleData.length > 0) {
        return {
          roleName: roleInput.toUpperCase(),
          permissions: typeof roleData[0].permissions === 'string'
            ? JSON.parse(roleData[0].permissions)
            : roleData[0].permissions
        };
      }
    } catch (error) {
      console.error("❌ Error fetching role by name:", error);
    }
    return { roleName: roleInput.toUpperCase(), permissions: [] };
  }

  return { roleName: "USER", permissions: [] };
}

// ========== HELPER: REORGANIZE usersTest IDs ==========
async function reorganizeUsersTable() {
  const users = await new Promise((resolve, reject) => {
    pool.query('SELECT * FROM usersTest ORDER BY id ASC', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  if (users.length === 0) {
    await new Promise((resolve, reject) => {
      pool.query('ALTER TABLE usersTest AUTO_INCREMENT = 1', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return { nextId: 1 };
  }

  for (let i = 0; i < users.length; i++) {
    const oldId = users[i].id;
    const tempId = -(i + 1);
    await new Promise((resolve, reject) => {
      pool.query('UPDATE usersTest SET id = ? WHERE id = ?', [tempId, oldId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await new Promise((resolve) => {
      pool.query('UPDATE user_profiles_test SET user_id = ? WHERE user_id = ?', [tempId, oldId], () => resolve());
    });
    await new Promise((resolve) => {
      pool.query('UPDATE user_profiles_test SET creator_user_id = ? WHERE creator_user_id = ?', [tempId, oldId], () => resolve());
    });
  }

  for (let i = 0; i < users.length; i++) {
    const tempId = -(i + 1);
    const newId = i + 1;
    await new Promise((resolve, reject) => {
      pool.query('UPDATE usersTest SET id = ? WHERE id = ?', [newId, tempId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await new Promise((resolve) => {
      pool.query('UPDATE user_profiles_test SET user_id = ? WHERE user_id = ?', [newId, tempId], () => resolve());
    });
    await new Promise((resolve) => {
      pool.query('UPDATE user_profiles_test SET creator_user_id = ? WHERE creator_user_id = ?', [newId, tempId], () => resolve());
    });
  }

  const nextId = users.length + 1;
  await new Promise((resolve, reject) => {
    pool.query(`ALTER TABLE usersTest AUTO_INCREMENT = ${nextId}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return { nextId };
}

// ========== SINGLE verifySuperadmin MIDDLEWARE ==========
// ✅ FIX: Only ONE definition, accepts any case (SUPERADMIN / superadmin)
function verifySuperadmin(req, res, next) {
  try {
    const role = req.body.role || req.headers["x-role"];
    if (role && role.toUpperCase() === "SUPERADMIN") return next();
    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    console.error("verifySuperadmin error:", err);
    return res.status(500).json({ error: "Authorization error" });
  }
}

// ========== ROLE MANAGEMENT ==========

app.get('/roles', (req, res) => {
  const sql = `
    SELECT r.*, u.name as creator_name 
    FROM roles r 
    LEFT JOIN usersTest u ON r.created_by = u.id
    ORDER BY r.id DESC
  `;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Error fetching roles:', err);
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
    const roles = result.map(role => ({
      ...role,
      permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions
    }));
    res.json(roles);
  });
});

app.post('/roles', (req, res) => {
  const { role_name, permissions, created_by } = req.body;
  if (!role_name) return res.status(400).json({ error: 'Role name is required' });

  const sql = 'INSERT INTO roles (role_name, permissions, created_by) VALUES (?, ?, ?)';
  pool.query(sql, [role_name, JSON.stringify(permissions || []), created_by], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Role name already exists' });
      return res.status(500).json({ error: 'Failed to create role' });
    }
    res.status(201).json({ id: result.insertId, role_name, permissions: permissions || [], created_by, message: 'Role created successfully' });
  });
});

app.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { role_name, permissions } = req.body;
  if (!role_name) return res.status(400).json({ error: 'Role name is required' });

  pool.query('UPDATE roles SET role_name = ?, permissions = ?, updated_at = NOW() WHERE id = ?',
    [role_name, JSON.stringify(permissions || []), id], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Role name already exists' });
        return res.status(500).json({ error: 'Failed to update role' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Role not found' });
      res.json({ id, role_name, permissions: permissions || [], message: 'Role updated successfully' });
    });
});

app.delete('/roles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      pool.query('DELETE FROM roles WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error('Role not found'));
        resolve();
      });
    });

    const roles = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM roles ORDER BY id ASC', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (roles.length === 0) {
      await new Promise((resolve, reject) => {
        pool.query('ALTER TABLE roles AUTO_INCREMENT = 1', (err) => { if (err) return reject(err); resolve(); });
      });
      return res.json({ message: 'Role deleted successfully', reorganized: true });
    }

    for (let i = 0; i < roles.length; i++) {
      const tempId = -(i + 1);
      await new Promise((resolve, reject) => {
        pool.query('UPDATE roles SET id = ? WHERE id = ?', [tempId, roles[i].id], (err) => { if (err) return reject(err); resolve(); });
      });
    }
    for (let i = 0; i < roles.length; i++) {
      await new Promise((resolve, reject) => {
        pool.query('UPDATE roles SET id = ? WHERE id = ?', [i + 1, -(i + 1)], (err) => { if (err) return reject(err); resolve(); });
      });
    }
    await new Promise((resolve, reject) => {
      pool.query(`ALTER TABLE roles AUTO_INCREMENT = ${roles.length + 1}`, (err) => { if (err) return reject(err); resolve(); });
    });

    res.json({ message: 'Role deleted and IDs reorganized successfully', reorganized: true });
  } catch (error) {
    if (error.message === 'Role not found') return res.status(404).json({ error: 'Role not found' });
    res.status(500).json({ error: 'Failed to delete role', details: error.message });
  }
});

// ========== USER MANAGEMENT ==========

app.get("/users", (req, res) => {
  // ✅ Ab hamesha saare users aayenge, koi filter nahi
  const sql = `
    SELECT up.*, parent.name as parent_name, parent.email as parent_email
    FROM user_profiles_test up
    LEFT JOIN user_profiles_test parent ON up.parent_id = parent.id
    ORDER BY up.id DESC
  `;
  pool.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch profiles" });
    const profiles = rows.map(p => {
      if (p.permissions && typeof p.permissions === 'string') {
        try { p.permissions = JSON.parse(p.permissions); } catch (e) { p.permissions = []; }
      }
      return p;
    });
    res.json(profiles);
  });
});

app.post("/profiles", async (req, res) => {
  const { name, username, email, phone, password, creatorUserId, role, permissions } = req.body;

  console.log("=== CREATE PROFILE REQUEST ===");
  console.log("Creator User ID:", creatorUserId);

  // ✅ FIX: phone optional from superadmin dashboard
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (phone) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!/^(\+\d{1,3})?\d{10}$/.test(cleanPhone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }
}
  if (!creatorUserId) {
    return res.status(400).json({ error: "Creator user ID is required" });
  }

  try {
    if (username && username.trim()) {
      const existingUsername = await new Promise((resolve, reject) => {
        pool.query('SELECT id FROM usersTest WHERE username = ?', [username.trim()], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (existingUsername.length > 0) return res.status(400).json({ error: 'Username already exists' });
    }

    const { roleName, permissions: rolePermissions } = await resolveRole(role);
    const finalRoleName = roleName.toUpperCase();
    const finalPermissions = permissions && permissions.length > 0 ? permissions : rolePermissions;

    pool.query("SELECT * FROM usersTest WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length > 0) return res.status(400).json({ error: "Email already exists!" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const finalUsername = (username && username.trim()) ? username.trim() : null;

      pool.query(
        "INSERT INTO usersTest (name, username, email, phone, password, role, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, finalUsername, email, phone || null, hashedPassword, finalRoleName, JSON.stringify(finalPermissions)],
        (err, userResult) => {
          if (err) return res.status(500).json({ error: "Failed to create user" });

          const newUserId = userResult.insertId;
          pool.query("SELECT id FROM user_profiles_test WHERE user_id = ? LIMIT 1", [creatorUserId], (err, creatorProfileResult) => {
            let parentProfileId = null;
            if (!err && creatorProfileResult.length > 0) parentProfileId = creatorProfileResult[0].id;

            pool.query(
              "INSERT INTO user_profiles_test (user_id, parent_id, creator_user_id, name, username, email, phone, role, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [newUserId, parentProfileId, creatorUserId, name, finalUsername, email, phone || null, finalRoleName, JSON.stringify(finalPermissions)],
              (err, profileResult) => {
                if (err) return res.status(500).json({ error: "Failed to create profile" });
                res.status(201).json({
                  message: "Profile created successfully",
                  profileId: profileResult.insertId,
                  userId: newUserId,
                  creatorUserId: creatorUserId
                });
              }
            );
          });
        }
      );
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const { name, username, email, phone, role, permissions } = req.body;

  try {
    if (username && username.trim()) {
      const existing = await new Promise((resolve, reject) => {
        pool.query('SELECT id FROM user_profiles_test WHERE username = ? AND id != ?', [username.trim(), id], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (existing.length > 0) return res.status(400).json({ error: 'Username already taken by another user' });
    }

    const { roleName, permissions: rolePermissions } = await resolveRole(role);
    const finalRoleName = roleName.toUpperCase();
    const finalPermissions = permissions && permissions.length > 0 ? permissions : rolePermissions;
    const finalUsername = (username && username.trim()) ? username.trim() : null;

    pool.query("SELECT user_id FROM user_profiles_test WHERE id = ?", [id], (err, profileResult) => {
      if (err) return res.status(500).json({ error: "Failed to get profile" });
      if (profileResult.length === 0) return res.status(404).json({ error: "Profile not found" });

      const userId = profileResult[0].user_id;

      pool.query(
        "UPDATE user_profiles_test SET name = ?, username = ?, email = ?, phone = ?, role = ?, permissions = ? WHERE id = ?",
        [name, finalUsername, email, phone || null, finalRoleName, JSON.stringify(finalPermissions), id],
        (err) => {
          if (err) return res.status(500).json({ error: "Failed to update profile" });

          pool.query(
            "UPDATE usersTest SET name = ?, username = ?, email = ?, phone = ?, role = ?, permissions = ? WHERE id = ?",
            [name, finalUsername, email, phone || null, finalRoleName, JSON.stringify(finalPermissions), userId],
            (userErr) => {
              if (userErr) console.error("⚠️ Could not sync user:", userErr);
              res.json({ message: "Profile updated successfully" });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { name, username, email, phone, password, role, permissions } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    if (username && username.trim()) {
      const existing = await new Promise((resolve, reject) => {
        pool.query('SELECT id FROM usersTest WHERE username = ?', [username.trim()], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (existing.length > 0) return res.status(400).json({ error: 'Username already exists' });
    }

    const countResult = await new Promise((resolve, reject) => {
      pool.query("SELECT COUNT(*) as count FROM usersTest", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const isFirstUser = countResult[0].count === 0;
    let finalRole = "USER";
    let finalPermissions = [];

    if (isFirstUser) {
      finalRole = "SUPERADMIN";
      finalPermissions = [];
      console.log('👑 Creating FIRST USER as SUPERADMIN');
    } else if (!role) {
      return res.status(400).json({ error: "Role selection is required." });
    } else {
      const resolved = await resolveRole(role);
      finalRole = resolved.roleName.toUpperCase();
      finalPermissions = permissions && permissions.length > 0 ? permissions : resolved.permissions;
    }

    const emailCheck = await new Promise((resolve, reject) => {
      pool.query("SELECT id FROM usersTest WHERE email = ?", [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    if (emailCheck.length > 0) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const finalUsername = (username && username.trim()) ? username.trim() : null;

    const userResult = await new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO usersTest (name, username, email, phone, password, role, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, finalUsername, email, phone, hashedPassword, finalRole, JSON.stringify(finalPermissions)],
        (err, result) => { if (err) return reject(err); resolve(result); }
      );
    });

    const userId = userResult.insertId;
    await new Promise((resolve) => {
      pool.query(
        "INSERT INTO user_profiles_test (user_id, parent_id, creator_user_id, name, username, email, phone, role, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, null, userId, name, finalUsername, email, phone, finalRole, JSON.stringify(finalPermissions)],
        () => resolve()
      );
    });

    res.json({
      message: isFirstUser
        ? "🎉 Congratulations! You are the first user and have been granted Super Admin privileges!"
        : "User created successfully",
      success: true,
      role: finalRole
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/profiles/:id", async (req, res) => {
  const { id } = req.params;

  // ✅ Single dedicated connection use karo taaki FOREIGN_KEY_CHECKS same connection pe kaam kare
  pool.getConnection(async (connErr, connection) => {
    if (connErr) return res.status(500).json({ error: 'Connection failed', details: connErr.message });

    const query = (sql, params = []) => new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    try {
      // Profile exist karta hai?
      const profileResult = await query("SELECT user_id, name, email FROM user_profiles_test WHERE id = ?", [id]);
      if (profileResult.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Profile not found' });
      }
      const user_id = profileResult[0].user_id;

      // ✅ Same connection pe foreign key checks band karo
      await query('SET FOREIGN_KEY_CHECKS = 0');

      // Child profiles delete karo
      await query("DELETE FROM user_profiles_test WHERE parent_id = ?", [id]);

      // Profile delete karo
      await query("DELETE FROM user_profiles_test WHERE id = ?", [id]);

      // User delete karo
      if (user_id) {
        await query("DELETE FROM usersTest WHERE id = ?", [user_id]);
      }

      // Reorganize user_profiles_test
      const profiles = await query('SELECT id FROM user_profiles_test ORDER BY id ASC');
      if (profiles.length > 0) {
        for (let i = 0; i < profiles.length; i++) {
          await query('UPDATE user_profiles_test SET parent_id = ? WHERE parent_id = ?', [-(i+1), profiles[i].id]);
          await query('UPDATE user_profiles_test SET id = ? WHERE id = ?', [-(i+1), profiles[i].id]);
        }
        for (let i = 0; i < profiles.length; i++) {
          await query('UPDATE user_profiles_test SET parent_id = ? WHERE parent_id = ?', [i+1, -(i+1)]);
          await query('UPDATE user_profiles_test SET id = ? WHERE id = ?', [i+1, -(i+1)]);
        }
        await query(`ALTER TABLE user_profiles_test AUTO_INCREMENT = ${profiles.length + 1}`);
      } else {
        await query('ALTER TABLE user_profiles_test AUTO_INCREMENT = 1');
      }

      // Reorganize usersTest
      const users = await query('SELECT id FROM usersTest ORDER BY id ASC');
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          await query('UPDATE user_profiles_test SET user_id = ? WHERE user_id = ?', [-(i+1), users[i].id]);
          await query('UPDATE user_profiles_test SET creator_user_id = ? WHERE creator_user_id = ?', [-(i+1), users[i].id]);
          await query('UPDATE usersTest SET id = ? WHERE id = ?', [-(i+1), users[i].id]);
        }
        for (let i = 0; i < users.length; i++) {
          await query('UPDATE user_profiles_test SET user_id = ? WHERE user_id = ?', [i+1, -(i+1)]);
          await query('UPDATE user_profiles_test SET creator_user_id = ? WHERE creator_user_id = ?', [i+1, -(i+1)]);
          await query('UPDATE usersTest SET id = ? WHERE id = ?', [i+1, -(i+1)]);
        }
        await query(`ALTER TABLE usersTest AUTO_INCREMENT = ${users.length + 1}`);
      } else {
        await query('ALTER TABLE usersTest AUTO_INCREMENT = 1');
      }

      // ✅ Foreign key checks wapas on karo
      await query('SET FOREIGN_KEY_CHECKS = 1');
      connection.release();

      res.json({ message: 'Profile deleted successfully', reorganized: true });

    } catch (error) {
      console.error('❌ Delete error:', error);
      try { await query('SET FOREIGN_KEY_CHECKS = 1'); } catch {}
      connection.release();
      if (error.message === 'Profile not found') return res.status(404).json({ error: 'Profile not found' });
      res.status(500).json({ error: 'Failed to delete profile', details: error.message });
    }
  });
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  // if (!captcha) return res.status(400).json({ message: "Captcha Missing" });

  // try {
  //   const captchaResponse = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
  //     params: { secret: process.env.RECAPTCHA_SECRET_KEY },
  //   });

  //   if (!captchaResponse.data.success && process.env.NODE_ENV === "production") {
  //     return res.status(403).json({ message: "Captcha verification failed" });
  //   }

    let sql;
    if (/^\d{10}$/.test(identifier)) {
      sql = "SELECT * FROM usersTest WHERE phone = ?";
    } else {
      sql = "SELECT * FROM usersTest WHERE email = ? OR username = ?";
    }

    const params = /^\d{10}$/.test(identifier) ? [identifier] : [identifier, identifier];

    pool.query(sql, params, async (err, result) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

      const userRole = (user.role || 'USER').toUpperCase();

      // ✅ Roles table se permissions fetch karo
      pool.query(
        "SELECT permissions FROM roles WHERE role_name = ?",
        [userRole],
        (roleErr, roleResult) => {
          if (roleErr) return res.status(500).json({ message: "Server Error" });

          let userPermissions = [];
          if (roleResult.length > 0 && roleResult[0].permissions) {
            try { userPermissions = JSON.parse(roleResult[0].permissions); }
            catch (e) { userPermissions = []; }
          }

          res.json({
            message: "Success",
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              phone: user.phone,
              role: userRole,
              permissions: userPermissions,
            },
          });
        }
      );
    });
  // } catch (error) {
  //   res.status(500).json({ message: "Captcha verification failed" });
  // }
});

app.post("/generate-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpCreatedAt = new Date();

  pool.query(
    "UPDATE usersTest SET otp = ?, otp_created_at = ? WHERE email = ?",
    [otp, otpCreatedAt, email.trim()],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Email not found" });

      res.json({ success: true, otp: otp });
    }
  );
});

app.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

  pool.query("SELECT * FROM usersTest WHERE email = ? AND otp = ?", [email.trim(), otp.trim()], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (result.length === 0) return res.status(400).json({ success: false, message: "Invalid OTP" });

    const user = result[0];
    const otpCreatedAt = new Date(user.otp_created_at);
    const diffDays = (new Date() - otpCreatedAt) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) return res.status(400).json({ success: false, message: "OTP expired" });

    // ✅ usersTest se sahi role lo
    pool.query("SELECT role FROM usersTest WHERE id = ?", [user.id], (roleErr, roleResult) => {
      const correctRole = (!roleErr && roleResult.length > 0) 
        ? (roleResult[0].role || 'USER').toUpperCase() 
        : (user.role || 'USER').toUpperCase();

    let userPermissions = [];
      if (user.permissions) {
        try { userPermissions = JSON.parse(user.permissions); }
        catch (e) { userPermissions = []; }
      }
      res.json({ 
        success: true, 
        message: "OTP verified", 
        user: { 
          id: user.id, 
          name: user.name, 
          username: user.username,
          email: user.email, 
          phone: user.phone,
          role: correctRole,
          permissions: userPermissions
        } 
      });
    });
  });
});

app.get("/users/:id", (req, res) => {
  pool.query("SELECT * FROM user_profiles_test WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Server Error" });
    if (result.length > 0) {
      const profile = result[0];
      if (profile.permissions && typeof profile.permissions === 'string') {
        try { profile.permissions = JSON.parse(profile.permissions); } catch (e) { profile.permissions = []; }
      }
      res.json(profile);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/users/:id/full", (req, res) => {
  pool.query(
    `SELECT u.id, u.name, u.username, u.email, u.phone, u.role, u.created_at,
            r.permissions
     FROM usersTest u
     LEFT JOIN roles r ON LOWER(r.role_name) = LOWER(u.role)
     WHERE u.id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server Error" });
      if (result.length > 0) {
        const user = result[0];
        if (user.permissions) {
          try { user.permissions = JSON.parse(user.permissions); } catch (e) { user.permissions = []; }
        } else {
          user.permissions = [];
        }
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  );
});
app.get("/users/:userId/profile", (req, res) => {
  pool.query("SELECT id FROM user_profiles_test WHERE user_id = ? LIMIT 1", [req.params.userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Server Error" });
    if (result.length > 0) {
      res.json({ profileId: result[0].id });
    } else {
      res.status(404).json({ error: "Profile not found" });
    }
  });
});

app.put("/account/:userId/basic-info", (req, res) => {
  const { userId } = req.params;
  const { name, email, phone } = req.body;

  pool.query("UPDATE usersTest SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone || null, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    pool.query("UPDATE user_profiles_test SET name = ?, email = ?, phone = ? WHERE user_id = ?", [name, email, phone || null, userId], (err2) => {
      if (err2) console.error("⚠️ Could not sync profiles:", err2);
      res.json({ message: "User updated successfully" });
    });
  });
});

app.put("/account/:userId/role-permissions", async (req, res) => {
  const { userId } = req.params;
  const { role, permissions } = req.body;

  if (!role) return res.status(400).json({ error: "Role required" });

  try {
    const { roleName, permissions: rolePermissions } = await resolveRole(role);
    const finalPermissions = permissions && permissions.length > 0 ? permissions : rolePermissions;

    pool.query("UPDATE usersTest SET role = ?, permissions = ? WHERE id = ?", [roleName, JSON.stringify(finalPermissions), userId], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to update" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

      pool.query("UPDATE user_profiles_test SET role = ?, permissions = ? WHERE user_id = ?", [roleName, JSON.stringify(finalPermissions), userId], (err2) => {
        if (err2) console.error("⚠️ Could not sync profiles:", err2);
        res.json({ message: "Role updated successfully", role: roleName, permissions: finalPermissions });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { identifier, newPassword } = req.body;
  if (!identifier || !newPassword) return res.status(400).json({ message: "All fields required" });

  const trimmedIdentifier = identifier.trim();
  const isPhone = /^\d{10}$/.test(trimmedIdentifier);
  const sql = isPhone ? "SELECT * FROM usersTest WHERE phone = ?" : "SELECT * FROM usersTest WHERE email = ?";

  pool.query(sql, [trimmedIdentifier], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    if (result.length === 0) {
      return res.status(404).json({ message: "Failed", error: isPhone ? "Phone not registered" : "Email not registered" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    pool.query("UPDATE usersTest SET password = ?, otp = NULL WHERE id = ?", [hashedPassword, result[0].id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server Error" });
      res.status(200).json({ message: "Password reset successfully" });
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM user_profiles_test WHERE user_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete profiles" });
    pool.query("DELETE FROM usersTest WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to delete user" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User deleted successfully" });
    });
  });
});

// ========== SUPERADMIN ROUTES ==========

// ✅ FIX: GET ALL USERS
app.post("/superadmin/users", verifySuperadmin, (req, res) => {
  pool.query("SELECT id, name, username, email, phone, role, permissions, created_at FROM usersTest ORDER BY created_at DESC", [], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    const users = result.map(user => {
      if (user.permissions) {
        try { user.permissions = JSON.parse(user.permissions); } catch (e) { user.permissions = []; }
      }
      return user;
    });
    res.json(users);
  });
});

// ✅ FIX: GET ALL PROFILES
app.post("/superadmin/profiles", verifySuperadmin, (req, res) => {
  const sql = `
    SELECT up.*, creator.name as owner_name, creator.email as owner_email, creator.role as owner_role
    FROM user_profiles_test up 
    LEFT JOIN usersTest creator ON up.creator_user_id = creator.id
    ORDER BY up.created_at DESC
  `;
  pool.query(sql, [], (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(result);
  });
});

// ✅ FIX: STATS — UPPER() so SUPERADMIN matches correctly
app.post("/superadmin/stats", verifySuperadmin, (req, res) => {
  const queries = {
    totalUsers:   "SELECT COUNT(*) as count FROM usersTest",
    totalProfiles:"SELECT COUNT(*) as count FROM user_profiles_test",
    superAdmins:  "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'SUPERADMIN'",
    regularUsers: "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'USER'",
    employees:    "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'EMPLOYEE'",
    managers:     "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'MANAGER'",
    admins:       "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'ADMIN'",
    contractors:  "SELECT COUNT(*) as count FROM usersTest WHERE UPPER(role) = 'CONTRACTOR'",
  };

  const stats = {};
  let completed = 0;
  Object.keys(queries).forEach((key) => {
    pool.query(queries[key], (err, result) => {
      stats[key] = err ? 0 : result[0].count;
      completed++;
      if (completed === Object.keys(queries).length) res.json(stats);
    });
  });
});

// ✅ FIX: SIGNUP ACCOUNTS — accepts SUPERADMIN uppercase
app.post("/superadmin/signup-accounts", (req, res) => {
  const { role } = req.body;

  // ✅ KEY FIX: toUpperCase() comparison
  if (!role || role.toUpperCase() !== "SUPERADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }

  const sql = `
    SELECT up.id, up.user_id, up.name, up.username, up.email, up.phone, up.role,
           up.permissions, up.parent_id, up.created_at, u.created_at as account_created_at
    FROM user_profiles_test up
    JOIN usersTest u ON up.user_id = u.id
    WHERE up.parent_id IS NULL
    ORDER BY up.created_at DESC
  `;

  pool.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch signup owner profiles" });
    const ownerProfiles = rows.map(profile => {
      if (profile.permissions && typeof profile.permissions === 'string') {
        try { profile.permissions = JSON.parse(profile.permissions); } catch (e) { profile.permissions = []; }
      }
      return profile;
    });
    res.json(ownerProfiles);
  });
});

// ✅ FIX: USERS BY ROLE — UPPER() for case-insensitive match
app.post("/superadmin/users-by-role", verifySuperadmin, (req, res) => {
  const { targetRole } = req.body;
  if (!targetRole) return res.status(400).json({ error: "Target role is required" });

  pool.query(
    "SELECT id, name, username, email, phone, role, permissions, created_at FROM usersTest WHERE UPPER(role) = UPPER(?) ORDER BY created_at DESC",
    [targetRole],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      const users = result.map(user => {
        if (user.permissions) {
          try { user.permissions = JSON.parse(user.permissions); } catch (e) { user.permissions = []; }
        }
        return user;
      });
      res.json(users);
    }
  );
});

app.post("/superadmin/create-admin", verifySuperadmin, async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

  try {
    pool.query("SELECT * FROM usersTest WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ error: "Server Error" });
      if (result.length > 0) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      pool.query(
        "INSERT INTO usersTest (name, email, phone, password, role, permissions) VALUES (?, ?, ?, ?, 'SUPERADMIN', ?)",
        [name, email, phone, hashedPassword, JSON.stringify([])],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Failed to create super admin" });
          res.json({ message: "Super admin created successfully", id: result.insertId });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/superadmin/update-role", verifySuperadmin, (req, res) => {
  const { targetUserId, newRole } = req.body;
  if (!targetUserId || !newRole) return res.status(400).json({ error: "Target user ID and new role are required" });

  const validRoles = ["USER", "SUPERADMIN", "EMPLOYEE", "MANAGER", "ADMIN", "CONTRACTOR"];
  if (!validRoles.includes(newRole.toUpperCase())) return res.status(400).json({ error: "Invalid role" });

  pool.query("UPDATE usersTest SET role = ? WHERE id = ?", [newRole.toUpperCase(), targetUserId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update user role" });
    if (result.affectedRows > 0) {
      res.json({ message: `User role updated to ${newRole.toUpperCase()} successfully` });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.post("/superadmin/update-permissions", verifySuperadmin, (req, res) => {
  const { targetUserId, permissions } = req.body;
  if (!targetUserId || !Array.isArray(permissions)) return res.status(400).json({ error: "Target user ID and permissions array are required" });

  pool.query("UPDATE usersTest SET permissions = ? WHERE id = ?", [JSON.stringify(permissions), targetUserId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update user permissions" });
    if (result.affectedRows > 0) {
      res.json({ message: "User permissions updated successfully", permissions });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.post("/superadmin/delete-user", verifySuperadmin, (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId) return res.status(400).json({ error: "Target user ID is required" });

  pool.query("DELETE FROM user_profiles_test WHERE user_id = ?", [targetUserId], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete user profiles" });

    pool.query("DELETE FROM usersTest WHERE id = ?", [targetUserId], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to delete user" });
      if (result.affectedRows > 0) {
        res.json({ message: "User and all associated profiles deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  });
});


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const memoryUpload = multer({ storage: multer.memoryStorage() });

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

console.log('upload middleware:', typeof upload); 

// ---- ITAR ORDERS ----
app.get('/orders/itar', (req, res) => {
  pool.query(
    `SELECT io.*, up.name as assigned_user_name, up.email as assigned_user_email
     FROM itar_orders io
     LEFT JOIN user_profiles_test up ON io.username = up.username
     ORDER BY io.id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch ITAR orders', details: err.message });
 
      // Fetch inline items for every order in parallel
      let pending = rows.length;
      if (pending === 0) return res.json([]);
 
      rows.forEach(row => {
        fetchInlineItems('itar_order_inline', 'itar_order_id', row.id, (iErr, items) => {
          row.items = iErr ? [] : items;
          pending--;
          if (pending === 0) res.json(rows);
        });
      });
    }
  );
});
 
app.get('/orders/itar/:id', (req, res) => {
  pool.query(
    `SELECT io.*, up.name as assigned_user_name
     FROM itar_orders io
     LEFT JOIN user_profiles_test up ON io.username = up.username
     WHERE io.id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch order' });
      if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      fetchInlineItems('itar_order_inline', 'itar_order_id', rows[0].id, (iErr, items) => {
        rows[0].items = iErr ? [] : items;
        res.json(rows[0]);
      });
    }
  );
});
 
app.post('/orders/itar', (req, res) => {
  const {
    orderDate, estNo, productType, manufacturerName,
    partNumber, specialRequest, qty, serialNumber,
    location, itarNo, shipDate, invoiceNo,
    orderStatus, username, createdByUserId, remark, items
  } = req.body;
 
  pool.query(
    `INSERT INTO itar_orders
       (order_date, est_no, product_type, manufacturer_name, part_number,
        special_request, qty, serial_number, location, itar_no,
        ship_date, invoice_no, order_status, username, created_by_user_id , remark )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
    [
      orderDate || null, estNo || null, productType || null,
      manufacturerName || null, partNumber || null,
      specialRequest || null, qty || null, serialNumber || null,
      location || null, itarNo || null, shipDate || null,
      invoiceNo || null, orderStatus || null,
      username || null, createdByUserId || null, remark || null
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create ITAR order', details: err.message });
 
      const newId = result.insertId;
      // Save inline items to itar_order_inline
      saveInlineItems(pool, 'itar_order_inline', 'itar_order_id', newId, items || [], (iErr) => {
        if (iErr) console.error('⚠️ Could not save ITAR inline items:', iErr.message);
        res.status(201).json({ id: newId, message: 'ITAR order created successfully' });
      });
    }
  );
});
 
app.put('/orders/itar/:id', (req, res) => {
  const { orderDate, estNo, productType, manufacturerName,
    partNumber, specialRequest, qty, serialNumber,
    location, itarNo, shipDate, invoiceNo,
    orderStatus, username, remark, items } = req.body;

  // ✅ Step 1: Pehle existing username fetch karo
  pool.query('SELECT username FROM itar_orders WHERE id=?', [req.params.id], (fetchErr, rows) => {
    if (fetchErr || rows.length === 0)
      return res.status(404).json({ error: 'Order not found' });

    // ✅ Step 2: Agar frontend se username aaya to use karo, warna purana rakho
    const finalUsername = username || rows[0].username;

    // ✅ Step 3: Ab update karo
    pool.query(
      `UPDATE itar_orders SET
         order_date=?, est_no=?, product_type=?, manufacturer_name=?,
         part_number=?, special_request=?, qty=?, serial_number=?,
         location=?, itar_no=?, ship_date=?, invoice_no=?,
         order_status=?, username=?, remark=?, updated_at=NOW()
       WHERE id=?`,
      [
        orderDate || null, estNo || null, productType || null,
        manufacturerName || null, partNumber || null,
        specialRequest || null, qty || null, serialNumber || null,
        location || null, itarNo || null, shipDate || null,
        invoiceNo || null, orderStatus || null,
        finalUsername,        // ✅ preserved username
        remark || null, req.params.id
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update', details: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

        saveInlineItems(pool, 'itar_order_inline', 'itar_order_id', req.params.id, items || [], (iErr) => {
          if (iErr) console.error('⚠️ Inline items error:', iErr.message);
          res.json({ message: 'ITAR order updated successfully' });
        });
      }
    );
  });
});

// ✅ DELETE pod file — pool style
app.delete('/orders/itar/pod-files/:id', (req, res) => {
  pool.query(
    'DELETE FROM order_pod_files WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete pod file', details: err.message });
      res.json({ success: true });
    }
  );
});
 

// ✅ GET pod files — pool style
app.get('/orders/itar/:id/pod-files', (req, res) => {
  pool.query(
    'SELECT * FROM order_pod_files WHERE order_id = ? AND order_type = "itar"',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch pod files', details: err.message });
      res.json(rows);
    }
  );
});

// ✅ POST upload pod file — pool style
app.post('/orders/itar/:id/pod-files', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  pool.query(
    'INSERT INTO order_pod_files (order_id, order_type, filename, original_name) VALUES (?, "itar", ?, ?)',
    [req.params.id, req.file.filename, req.file.originalname],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to save pod file', details: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});


app.delete('/orders/itar/:id', (req, res) => {
  // ON DELETE CASCADE handles itar_order_inline automatically
  pool.query('DELETE FROM itar_orders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete ITAR order' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'ITAR order deleted successfully' });
  });
});

 
// ============================================================
// HARDWARE ORDERS  (complete replacement)
// ============================================================
 
app.get('/orders/hardware', (req, res) => {
  pool.query(
    `SELECT ho.*, up.name as assigned_user_name, up.email as assigned_user_email
     FROM hardware_orders ho
     LEFT JOIN user_profiles_test up ON ho.assigned_username = up.username
     ORDER BY ho.id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch hardware orders', details: err.message });
 
      let pending = rows.length;
      if (pending === 0) return res.json([]);
 
      rows.forEach(row => {
        fetchInlineItems('hardware_order_inline', 'hardware_order_id', row.id, (iErr, items) => {
          row.items = iErr ? [] : items;
          pending--;
          if (pending === 0) res.json(rows);
        });
      });
    }
  );
});
 
app.get('/orders/hardware/:id', (req, res) => {
  pool.query(
    `SELECT ho.*, up.name as assigned_user_name
     FROM hardware_orders ho
     LEFT JOIN user_profiles_test up ON ho.assigned_username = up.username
     WHERE ho.id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch order' });
      if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      fetchInlineItems('hardware_order_inline', 'hardware_order_id', rows[0].id, (iErr, items) => {
        rows[0].items = iErr ? [] : items;
        res.json(rows[0]);
      });
    }
  );
});
 
app.post('/orders/hardware', (req, res) => {
  const {
  orderDate, estNo, assignedUsername, productType,
  manufacturerName, partNumber, specialRequest, qty, serialNumber,
  location, hardwareNo, shipDate, invoiceNo,
  orderStatus, createdByUserId, items, remark
} = req.body;

pool.query(
  `INSERT INTO hardware_orders
     (order_date, est_no, assigned_username, product_type, manufacturer_name,
      part_number, special_request, qty, serial_number, location, hardware_no,
      ship_date, invoice_no, order_status, created_by_user_id, remark)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    orderDate || null, estNo || null, assignedUsername || null,
    productType || null, manufacturerName || null, partNumber || null,
    specialRequest || null, qty || null, serialNumber || null, location || null,
    hardwareNo || null, shipDate || null, invoiceNo || null,
    orderStatus || null, createdByUserId || null, remark || null
  ],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create hardware order', details: err.message });
 
      const newId = result.insertId;
      saveInlineItems(pool, 'hardware_order_inline', 'hardware_order_id', newId, items || [], (iErr) => {
        if (iErr) console.error('⚠️ Could not save hardware inline items:', iErr.message);
        res.status(201).json({ id: newId, message: 'Hardware order created successfully' });
      });
    }
  );
});
 
app.put('/orders/hardware/:id', (req, res) => {
  const {
    orderDate, estNo, assignedUsername, productType,
    manufacturerName, partNumber, specialRequest, qty, serialNumber,
    location, hardwareNo, shipDate, invoiceNo,
    orderStatus, items, remark
  } = req.body;

  // ✅ Step 1: Pehle existing assigned_username fetch karo
  pool.query('SELECT assigned_username FROM hardware_orders WHERE id=?', [req.params.id], (fetchErr, rows) => {
    if (fetchErr || rows.length === 0)
      return res.status(404).json({ error: 'Order not found' });

    // ✅ Step 2: Null aaye to purana rakho
    const finalUsername = assignedUsername || rows[0].assigned_username;

    pool.query(
      `UPDATE hardware_orders SET
         order_date=?, est_no=?, assigned_username=?, product_type=?,
         manufacturer_name=?, part_number=?, special_request=?, qty=?, serial_number=?,
         location=?, hardware_no=?, ship_date=?, invoice_no=?,
         order_status=?, remark=?, updated_at=NOW()
       WHERE id=?`,
      [
        orderDate || null, estNo || null,
        finalUsername,        // ✅ preserved
        productType || null, manufacturerName || null, partNumber || null,
        specialRequest || null, qty || null, serialNumber || null, location || null,
        hardwareNo || null, shipDate || null, invoiceNo || null,
        orderStatus || null, remark || null, req.params.id
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update hardware order', details: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

        saveInlineItems(pool, 'hardware_order_inline', 'hardware_order_id', req.params.id, items || [], (iErr) => {
          if (iErr) console.error('⚠️ Could not update hardware inline items:', iErr.message);
          res.json({ message: 'Hardware order updated successfully' });
        });
      }
    );
  });
});
 
app.delete('/orders/hardware/:id', (req, res) => {
  pool.query('DELETE FROM hardware_orders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete hardware order' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Hardware order deleted successfully' });
  });
});
 

// GET hardware pod files
app.get('/orders/hardware/:id/pod-files', (req, res) => {
  pool.query(
    'SELECT * FROM hardware_pod_files WHERE order_id = ?',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/orders/hardware/:id/pod-files', upload.single('file'), (req, res) => {
  console.log('✅ ROUTE HIT HUA');
  console.log('📁 File:', req.file);
  console.log('🆔 ID:', req.params.id);

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  pool.query(
    'INSERT INTO hardware_pod_files (order_id, order_type, filename, original_name) VALUES (?, "hardware", ?, ?)',
    [req.params.id, req.file.filename, req.file.originalname],
    (err, result) => {
      if (err) {
        console.error('❌ DB Error:', err.code, err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ Insert success:', result);
      res.json({ success: true });
    }
  );
});

// DELETE hardware pod file
app.delete('/orders/hardware/pod-files/:id', (req, res) => {
  pool.query(
    'DELETE FROM hardware_pod_files WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});



// ✅ CORRECT ORDER — specific routes FIRST

// 1. NEW routes
app.get('/warranty/order-main/:orderId', (req, res) => {
  pool.query(
    'SELECT * FROM hardware_warranty WHERE hardware_order_id = ? AND hardware_order_inline_id IS NULL',
    [req.params.orderId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.json(null);
      res.json(rows[0]);
    }
  );
});

app.post('/warranty/order-main', (req, res) => {
  const { hardwareOrderId, serialNumber, productName, purchaseDate, expiryDate } = req.body;
  pool.query(
    `INSERT INTO hardware_warranty 
       (hardware_order_id, hardware_order_inline_id, serial_number, product_name, purchase_date, expiry_date)
     VALUES (?, NULL, ?, ?, ?, ?)`,
    [hardwareOrderId, serialNumber, productName, purchaseDate || null, expiryDate || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

app.put('/warranty/order-main/:orderId', (req, res) => {
  const { serialNumber, productName, purchaseDate, expiryDate } = req.body;
  pool.query(
    `UPDATE hardware_warranty SET serial_number=?, product_name=?, purchase_date=?, expiry_date=?
     WHERE hardware_order_id = ? AND hardware_order_inline_id IS NULL`,
    [serialNumber, productName, purchaseDate || null, expiryDate || null, req.params.orderId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// 2. EXISTING specific route
app.get('/warranty/order/:orderId', (req, res) => {
  const { orderId } = req.params;
  pool.query(
    `SELECT hw.* 
     FROM hardware_warranty hw
     INNER JOIN hardware_order_inline hoi 
       ON hw.hardware_order_inline_id = hoi.id
     WHERE hoi.hardware_order_id = ?`,
    [orderId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 3. GENERIC route LAST — always
app.get('/warranty/:inlineItemId', (req, res) => {
  pool.query(
    `SELECT * FROM hardware_warranty WHERE hardware_order_inline_id = ?`,
    [req.params.inlineItemId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.json(null);
      res.json(rows[0]);
    }
  );
});


// ============================================================
// AV POS ORDERS  (complete replacement)
// ============================================================
 
// ✅ STEP 1 — Multer setup sabse upar rakho (routes se pehle)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ STEP 2 — Specific routes PEHLE, generic (:id) routes BAAD MEIN

// POD Upload
app.post('/orders/avpos/upload-pod', upload.single('file'), (req, res) => {
  const { orderId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  pool.query(
    `INSERT INTO av_pos_pod_files (av_pos_order_id, filename, original_name) VALUES (?, ?, ?)`,
    [orderId, req.file.filename, req.file.originalname],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        success: true,
        id: result.insertId,
        filename: req.file.filename,
        originalName: req.file.originalname
      });
    }
  );
});

const ExcelJS = require('exceljs');

// ✅ YE ROUTE sabse upar rakho — POST /orders/avpos ke baad, PUT /:id se PEHLE
app.post('/orders/avpos/generate-pod', (req, res) => {
  const { orderId } = req.body;

  // Step 1: Order fetch karo
  pool.query(
    `SELECT ap.*, up.name as assigned_user_name 
     FROM av_pos_orders ap
     LEFT JOIN user_profiles_test up ON ap.assigned_username = up.username
     WHERE ap.id = ?`,
    [orderId],
    async (err, orderRows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orderRows.length === 0) return res.status(404).json({ error: 'Order not found' });

      const order = orderRows[0];

      // Step 2: Items fetch karo
      pool.query(
        `SELECT * FROM av_pos_order_inline WHERE av_pos_order_id = ?`,
        [orderId],
        async (err2, itemRows) => {
          if (err2) return res.status(500).json({ error: err2.message });

          try {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('POD');

            // Title
            sheet.mergeCells('A1:G1');
            const titleCell = sheet.getCell('A1');
            titleCell.value = 'OPG | AV POS Orders List';
            titleCell.font = { bold: true, size: 14 };
            titleCell.alignment = { horizontal: 'center' };

            // Order info
            sheet.addRow([]);
            sheet.addRow(['PO#', order.av_pos_no || '—', '', 'Order Date', order.order_date ? String(order.order_date).substring(0,10) : '—']);
            sheet.addRow(['Invoice#', order.invoice_no || '—', '', 'Ship Date', order.ship_date ? String(order.ship_date).substring(0,10) : '—']);
            sheet.addRow(['Location', order.location || '—', '', 'Status', order.order_status || '—']);
            sheet.addRow(['Assigned To', order.assigned_user_name || order.assigned_username || '—']);
            sheet.addRow([]);

            // Header row
            const headerRow = sheet.addRow(['Line', 'Product Type', 'Part Number', 'Manufacturer', 'Description', 'QTY', 'Serial No.']);
            headerRow.font = { bold: true };
            headerRow.eachCell(cell => {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE7F3' } };
              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });

            // Items
            itemRows.forEach((item, i) => {
              const row = sheet.addRow([
                i + 1,
                item.product_type || '—',
                item.part_number || item.special_request || '—',
                item.manufacturer_name || '—',
                item.description || '—',
                item.qty || '—',
                item.serial_number || '—'
              ]);
              row.eachCell(cell => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
              });
            });

            sheet.columns = [
              { width: 8 }, { width: 16 }, { width: 24 },
              { width: 20 }, { width: 30 }, { width: 8 }, { width: 18 }
            ];

            // File save karo
            const filename = `${Date.now()}_pod.xlsx`;
            const filepath = path.join(__dirname, 'uploads', filename);
            await workbook.xlsx.writeFile(filepath);

            // DB mein save karo
            pool.query(
              `INSERT INTO av_pos_pod_files (av_pos_order_id, filename, original_name) VALUES (?, ?, ?)`,
              [orderId, filename, `POD_${order.av_pos_no || orderId}.xlsx`],
              async (err3) => {
                if (err3) console.error('⚠️ Could not save pod file to DB:', err3.message);

                // Response bhejo
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=POD_${order.av_pos_no || orderId}.xlsx`);
                await workbook.xlsx.write(res);
                res.end();
              }
            );

          } catch (excelErr) {
            console.error('❌ Excel error:', excelErr);
            res.status(500).json({ error: excelErr.message });
          }
        }
      );
    }
  );
});

// POD File Delete — specific route (:fileId) pehle
app.delete('/orders/avpos/pod-files/:fileId', (req, res) => {
  pool.query(`SELECT * FROM av_pos_pod_files WHERE id = ?`, [req.params.fileId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'File not found' });
    const filename = results[0].filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    pool.query(`DELETE FROM av_pos_pod_files WHERE id = ?`, [req.params.fileId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true });
    });
  });
});

// GET all orders
app.get('/orders/avpos', (req, res) => {
  pool.query(
    `SELECT ap.*, up.name as assigned_user_name, up.email as assigned_user_email
     FROM av_pos_orders ap
     LEFT JOIN user_profiles_test up ON ap.assigned_username = up.username
     ORDER BY ap.id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch AV POS orders', details: err.message });
      let pending = rows.length;
      if (pending === 0) return res.json([]);
      rows.forEach(row => {
        fetchInlineItems('av_pos_order_inline', 'av_pos_order_id', row.id, (iErr, items) => {
          row.items = iErr ? [] : items;
          // ✅ POD files bhi fetch karo
          pool.query(
            `SELECT * FROM av_pos_pod_files WHERE av_pos_order_id = ? ORDER BY created_at ASC`,
            [row.id],
            (pErr, podFiles) => {
              row.pod_files = pErr ? [] : podFiles;
              pending--;
              if (pending === 0) res.json(rows);
            }
          );
        });
      });
    }
  );
});

// GET single order — pod_files bhi include
app.get('/orders/avpos/:id', (req, res) => {
  pool.query(
    `SELECT ap.*, up.name as assigned_user_name
     FROM av_pos_orders ap
     LEFT JOIN user_profiles_test up ON ap.assigned_username = up.username
     WHERE ap.id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch order' });
      if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      fetchInlineItems('av_pos_order_inline', 'av_pos_order_id', rows[0].id, (iErr, items) => {
        rows[0].items = iErr ? [] : items;
        pool.query(
          `SELECT * FROM av_pos_pod_files WHERE av_pos_order_id = ? ORDER BY created_at ASC`,
          [rows[0].id],
          (pErr, podFiles) => {
            rows[0].pod_files = pErr ? [] : podFiles;
            res.json(rows[0]);
          }
        );
      });
    }
  );
});

// GET pod-files by order id
app.get('/orders/avpos/:id/pod-files', (req, res) => {
  pool.query(
    `SELECT * FROM av_pos_pod_files WHERE av_pos_order_id = ? ORDER BY created_at ASC`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// POST create order
app.post('/orders/avpos', (req, res) => {
 const {
  orderDate, estNo, productType, assignedUsername,
  manufacturerName, partNumber, specialRequest, qty, serialNumber,
  location, avPosNo, shipDate, invoiceNo,
  orderStatus, sow, createdByUserId, remark, items
} = req.body;

pool.query(
  `INSERT INTO av_pos_orders
     (order_date, est_no, product_type, assigned_username,
      manufacturer_name, part_number, special_request, qty, serial_number,
      location, av_pos_no, ship_date, invoice_no,
      order_status, sow, created_by_user_id, remark)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    orderDate || null, estNo || null, productType || null,
    assignedUsername || null, manufacturerName || null,
    partNumber || null, specialRequest || null, qty || null, serialNumber || null,
    location || null, avPosNo || null, shipDate || null,
    invoiceNo || null, orderStatus || null,
    sow || null, createdByUserId || null, remark || null
  ],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create AV POS order', details: err.message });
      const newId = result.insertId;
      saveInlineItems(pool, 'av_pos_order_inline', 'av_pos_order_id', newId, items || [], (iErr) => {
        if (iErr) console.error('⚠️ Could not save AV POS inline items:', iErr.message);
        res.status(201).json({ id: newId, message: 'AV POS order created successfully' });
      });
    }
  );
});

// PUT update order
app.put('/orders/avpos/:id', (req, res) => {
  const {
    orderDate, estNo, productType, assignedUsername,
    manufacturerName, partNumber, specialRequest, qty, serialNumber,
    location, avPosNo, shipDate, invoiceNo,
    orderStatus, sow, remark, items
  } = req.body;

  // ✅ FIX: Pehle purana assigned_username fetch karo
  pool.query('SELECT assigned_username FROM av_pos_orders WHERE id=?', [req.params.id], (fetchErr, rows) => {
    if (fetchErr || rows.length === 0)
      return res.status(404).json({ error: 'Order not found' });

    // ✅ Null aaye to purana username rakho — overwrite mat karo
    const finalUsername = assignedUsername || rows[0].assigned_username;

    pool.query(
      `UPDATE av_pos_orders SET
         order_date=?, est_no=?, product_type=?, assigned_username=?,
         manufacturer_name=?, part_number=?, special_request=?, qty=?, serial_number=?,
         location=?, av_pos_no=?, ship_date=?, invoice_no=?,
         order_status=?, sow=?, remark=?, updated_at=NOW()
       WHERE id=?`,
      [
        orderDate || null, estNo || null, productType || null,
        finalUsername,                    // ✅ preserved username
        manufacturerName || null,
        partNumber || null, specialRequest || null, qty || null, serialNumber || null,
        location || null, avPosNo || null, shipDate || null,
        invoiceNo || null, orderStatus || null,
        sow || null, remark || null, req.params.id
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update AV POS order', details: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

        saveInlineItems(pool, 'av_pos_order_inline', 'av_pos_order_id', req.params.id, items || [], (iErr) => {
          if (iErr) console.error('⚠️ Could not update AV POS inline items:', iErr.message);
          res.json({ message: 'AV POS order updated successfully' });
        });
      }
    );
  });
});

// DELETE order
app.delete('/orders/avpos/:id', (req, res) => {
  pool.query('DELETE FROM av_pos_orders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete AV POS order' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'AV POS order deleted successfully' });
  });
});
 
// ============================================================
// HARDWARE & SOFTWARE POS  (complete replacement)
// ============================================================
 
app.get('/orders/hwswpos', (req, res) => {
  pool.query(
    `SELECT hs.*, up.name as assigned_user_name, up.email as assigned_user_email
     FROM hardware_software_pos hs
     LEFT JOIN user_profiles_test up ON hs.assigned_username = up.username
     ORDER BY hs.id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch HW/SW POS orders', details: err.message });
 
      let pending = rows.length;
      if (pending === 0) return res.json([]);
 
      rows.forEach(row => {
        fetchInlineItems('hardware_software_pos_inline', 'hw_sw_pos_id', row.id, (iErr, items) => {
          row.items = iErr ? [] : items;
          pending--;
          if (pending === 0) res.json(rows);
        });
      });
    }
  );
});

// ✅ SPECIFIC ROUTE PEHLE - pod-files
app.get('/orders/hwswpos/:orderId/pod-files', (req, res) => {
  pool.query(
    `SELECT * FROM hwswpos_pod_files WHERE order_id = ?`,
    [req.params.orderId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ✅ GENERIC :id ROUTE BAAD MEIN
app.get('/orders/hwswpos/:id', (req, res) => {
  pool.query(
    `SELECT hs.*, up.name as assigned_user_name
     FROM hardware_software_pos hs
     LEFT JOIN user_profiles_test up ON hs.assigned_username = up.username
     WHERE hs.id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch order' });
      if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      fetchInlineItems('hardware_software_pos_inline', 'hw_sw_pos_id', rows[0].id, (iErr, items) => {
        rows[0].items = iErr ? [] : items;
        res.json(rows[0]);
      });
    }
  );
});

app.post('/orders/hwswpos', (req, res) => {
  const {
  orderDate, estNo, productType, assignedUsername,
  manufacturerName, partNumber, specialRequest, qty, serialNumber,
  location, poNo, shipDate, invoiceNo,
  orderStatus, createdByUserId, items, remark
} = req.body;

pool.query(
  `INSERT INTO hardware_software_pos
     (order_date, est_no, product_type, assigned_username,
      manufacturer_name, part_number, special_request, qty, serial_number,
      location, po_no, ship_date, invoice_no,
      order_status, remark, created_by_user_id)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    orderDate || null, estNo || null, productType || null,
    assignedUsername || null, manufacturerName || null,
    partNumber || null, specialRequest || null, qty || null, serialNumber || null,
    location || null, poNo || null, shipDate || null,
    invoiceNo || null, orderStatus || null,
    remark || null, createdByUserId || null
  ],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create HW/SW POS order', details: err.message });
      const newId = result.insertId;
      saveInlineItems(pool, 'hardware_software_pos_inline', 'hw_sw_pos_id', newId, items || [], (iErr) => {
        if (iErr) console.error('⚠️ Could not save HW/SW POS inline items:', iErr.message);
        res.status(201).json({ id: newId, message: 'HW/SW POS order created successfully' });
      });
    }
  );
});

// ✅ upload-pod SPECIFIC PEHLE
app.post('/orders/hwswpos/upload-pod', upload.single('file'), (req, res) => {
  const { orderId } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  pool.query(
    `INSERT INTO hwswpos_pod_files (order_id, filename, original_name) VALUES (?, ?, ?)`,
    [orderId, req.file.filename, req.file.originalname],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, filename: req.file.filename, originalName: req.file.originalname });
    }
  );
});

app.put('/orders/hwswpos/:id', (req, res) => {
  const {
    orderDate, estNo, productType, assignedUsername,
    manufacturerName, partNumber, specialRequest, qty, serialNumber,
    location, poNo, shipDate, invoiceNo,
    orderStatus, items, remark
  } = req.body;

  // ✅ Step 1: Pehle purana assigned_username fetch karo
  pool.query('SELECT assigned_username FROM hardware_software_pos WHERE id=?', [req.params.id], (fetchErr, rows) => {
    if (fetchErr || rows.length === 0)
      return res.status(404).json({ error: 'Order not found' });

    // ✅ Step 2: Null aaye to purana rakho
    const finalUsername = assignedUsername || rows[0].assigned_username;

    // ✅ Step 3: Ab update karo
    pool.query(
      `UPDATE hardware_software_pos SET
         order_date=?, est_no=?, product_type=?, assigned_username=?,
         manufacturer_name=?, part_number=?, special_request=?, qty=?, serial_number=?,
         location=?, po_no=?, ship_date=?, invoice_no=?,
         order_status=?, remark=?, updated_at=NOW()
       WHERE id=?`,
      [
        orderDate || null, estNo || null, productType || null,
        finalUsername,              // ✅ preserved username
        manufacturerName || null,
        partNumber || null, specialRequest || null, qty || null, serialNumber || null,
        location || null, poNo || null, shipDate || null,
        invoiceNo || null, orderStatus || null,
        remark || null, req.params.id
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update HW/SW POS order', details: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

        saveInlineItems(pool, 'hardware_software_pos_inline', 'hw_sw_pos_id', req.params.id, items || [], (iErr) => {
          if (iErr) console.error('⚠️ Could not update HW/SW POS inline items:', iErr.message);
          res.json({ message: 'HW/SW POS order updated successfully' });
        });
      }
    );
  });
});

// ✅ DELETE pod-file SPECIFIC PEHLE
app.delete('/orders/hwswpos/pod-files/:fileId', (req, res) => {
  pool.query(
    `DELETE FROM hwswpos_pod_files WHERE id = ?`,
    [req.params.fileId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Deleted successfully' });
    }
  );
});

app.delete('/orders/hwswpos/:id', (req, res) => {
  pool.query('DELETE FROM hardware_software_pos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete HW/SW POS order' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'HW/SW POS order deleted successfully' });
  });
});

// ============================================================
// MANUFACTURERS
// ============================================================
app.get('/manufacturers', (req, res) => {
  pool.query('SELECT * FROM manufacturers ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/manufacturers', (req, res) => {
  const { name, productType } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  pool.query(
    'INSERT INTO manufacturers (name, product_type) VALUES (?, ?)',
    [name, productType || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, productType });
    }
  );
});

app.put('/manufacturers/:id', (req, res) => {
  const { name, productType } = req.body;
  pool.query(
    'UPDATE manufacturers SET name=?, product_type=? WHERE id=?',
    [name, productType || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/manufacturers/:id', (req, res) => {
  pool.query(
    'DELETE FROM manufacturers WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ============================================================
// PRODUCTS
// ============================================================
app.get('/products', (req, res) => {
  pool.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/products', (req, res) => {
  const { productType, partNumber, manufacturerName, productDescription, extraDetails, productImage } = req.body;
  if (!partNumber) return res.status(400).json({ error: 'Part number is required' });
  pool.query(
    'INSERT INTO products (product_type, part_number, manufacturer_name, product_description, extra_details, product_image) VALUES (?, ?, ?, ?, ?, ?)',
    [productType || null, partNumber, manufacturerName || null, productDescription || null, extraDetails || null, productImage || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Product created successfully' });
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { productType, partNumber, manufacturerName, 
          productDescription, extraDetails, productImage } = req.body;

  // ✅ Step 1: Pehle purana product_image fetch karo
  pool.query('SELECT product_image FROM products WHERE id=?', [req.params.id], (fetchErr, rows) => {
    if (fetchErr || rows.length === 0)
      return res.status(404).json({ error: 'Product not found' });

    // ✅ Step 2: Naya image aaya to use karo, warna purana rakho
    const finalImage = productImage || rows[0].product_image;

    pool.query(
      `UPDATE products SET 
         product_type=?, part_number=?, manufacturer_name=?, 
         product_description=?, extra_details=?, product_image=? 
       WHERE id=?`,
      [
        productType || null, partNumber || null,
        manufacturerName || null, productDescription || null,
        extraDetails || null,
        finalImage,          // ✅ preserved image
        req.params.id
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Product updated successfully' });
      }
    );
  });
});
app.delete('/products/:id', (req, res) => {
  pool.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Product deleted successfully' });
  });
});


// GET warranty by inline item id
app.get('/warranty/:inlineItemId', (req, res) => {
  pool.query(
    `SELECT * FROM hardware_warranty WHERE hardware_order_inline_id = ?`,
    [req.params.inlineItemId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch warranty', details: err.message });
      if (rows.length === 0) return res.json(null);
      res.json(rows[0]);
    }
  );
});

// POST warranty (create or update)
app.post('/warranty', (req, res) => {
  const { hardwareOrderId, hardwareOrderInlineId, serialNumber, productName, purchaseDate, expiryDate } = req.body;

  pool.query(
    `SELECT id FROM hardware_warranty WHERE hardware_order_inline_id = ?`,
    [hardwareOrderInlineId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to check warranty', details: err.message });

      if (rows.length > 0) {
        pool.query(
          `UPDATE hardware_warranty SET serial_number=?, product_name=?, purchase_date=?, expiry_date=?, updated_at=NOW() WHERE hardware_order_inline_id=?`,
          [serialNumber || null, productName || null, purchaseDate || null, expiryDate || null, hardwareOrderInlineId],
          (uErr) => {
            if (uErr) return res.status(500).json({ error: 'Failed to update warranty', details: uErr.message });
            res.json({ message: 'Warranty updated successfully' });
          }
        );
   } else {
        pool.query(
         `INSERT INTO hardware_warranty (hardware_order_id, hardware_order_inline_id, serial_number, product_name, purchase_date, expiry_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
[hardwareOrderId || null, hardwareOrderInlineId, serialNumber || null, productName || null, purchaseDate || null, expiryDate || null],
          (iErr, result) => {
            if (iErr) return res.status(500).json({ error: 'Failed to create warranty', details: iErr.message });
            res.status(201).json({ id: result.insertId, message: 'Warranty created successfully' });
          }
        );
      }
    }
  );
});



// ✅ memoryUpload.single se change karo
app.post('/tickets', memoryUpload.single('image'), async (req, res) => {
  console.log('REQ BODY:', req.body);
  
  const { 
    orderId, orderType, lineNo, itemId, email, comment,
    productType, partNumber, manufacturerName, serialNumber, qty, description 
  } = req.body;

  try {
    // ✅ Step 1 — DB mein save karo
    const [result] = await pool.promise().query(
      `INSERT INTO tickets 
        (order_id, order_type, line_no, item_id, email, comment, created_at, image_path, image_filename)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [
        orderId    || null,
        orderType  || null,
        lineNo     || null,
        itemId     || null,
        email      || null,
        comment    || null,
        req.file?.originalname || null,
        req.file?.originalname || null
      ]
    );
    const ticketId = result.insertId;
    const orderLabel = (orderType || 'ORDER').toUpperCase();

    // ✅ Step 2 — Image base64 directly from buffer
    let imageHtml = '—';
    if (req.file && req.file.buffer) {
      const base64Image = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype || 'image/jpeg';
      imageHtml = `<img src="data:${mimeType};base64,${base64Image}" 
                        style="max-width:220px;border-radius:6px;margin-top:4px;" />`;
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 620px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    h2 { color: #1e3a5f; margin: 0 0 8px 0; font-size: 22px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; }
    td { padding: 13px 16px; border: 1px solid #e0e0e0; font-size: 14px; vertical-align: top; line-height: 1.5; }
    td:first-child { font-weight: 700; background: #f8f8f8; width: 160px; white-space: nowrap; color: #1e3a5f; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New ${orderLabel} Ticket Created</h2>
    <p class="subtitle">Ticket details:</p>
    <table>
      <tr><td>Email ID</td><td>${email || '—'}</td></tr>
      <tr><td>Product Type</td><td>${productType || '—'}</td></tr>
      <tr><td>Part Number</td><td>${partNumber || '—'}</td></tr>
      <tr><td>Manufacturer</td><td>${manufacturerName || '—'}</td></tr>
      <tr><td>Description</td><td>${description || '—'}</td></tr>
      <tr><td>Serial Number</td><td>${serialNumber || '—'}</td></tr>
      <tr><td>Quantity</td><td>${qty || '—'}</td></tr>
      <tr><td>Comment</td><td>${comment || '—'}</td></tr>
      <tr><td>Image</td><td>${imageHtml}</td></tr>
    </table>
  </div>
</body>
</html>`;

    // ✅ Step 3 — Resend se email bhejo
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `New ${orderLabel} Ticket — Order #${orderId} Line ${lineNo}`,
        html: emailHtml,
      });
      console.log('✅ Ticket email sent to:', email);
    } catch (emailErr) {
      console.error('⚠️ Email failed but ticket saved:', emailErr.message);
    }

    res.json({ success: true, ticketId, message: 'Ticket created and email sent' });

  } catch (err) {
    console.error('❌ Ticket DB error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/tickets/:orderType/:orderId', (req, res) => {
  pool.query(
    `SELECT * FROM tickets WHERE order_id = ? AND order_type = ? ORDER BY created_at DESC`,
    [req.params.orderId, req.params.orderType],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get('/tickets/:orderType/:orderId', (req, res) => {
  pool.query(
    `SELECT * FROM tickets WHERE order_id = ? AND order_type = ? ORDER BY created_at DESC`,
    [req.params.orderId, req.params.orderType],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});


app.post('/resend-payment-link', async (req, res) => {
  const { email, link, itarNo, orderId } = req.body;
  
  console.log('=== RESEND PAYMENT ===', req.body);
  
  if (!email || !link) {
    return res.status(400).json({ error: 'Email and link required' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Payment Link — ITAR Order #${itarNo || orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;background:#fff;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
          <h2 style="color:#1e3a5f;margin:0 0 16px;">💳 Payment Link</h2>
          <p style="color:#555;font-size:14px;">ITAR Order: <strong>#${itarNo || orderId}</strong></p>
          <p style="color:#555;font-size:14px;">Please click the link below to complete your payment:</p>
          <div style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:16px;margin:16px 0;word-break:break-all;">
            <a href="${link}" style="color:#2d5a9e;font-weight:600;font-size:14px;">${link}</a>
          </div>
          <a href="${link}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
            Pay Now →
          </a>
        </div>`
    });

    res.json({ success: true, message: 'Payment link sent' });

  } catch (err) {
    console.error('Resend payment error:', err);
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at https://localhost:${PORT}`);
  console.log(`✅ ALL FIXES APPLIED - UPPERCASE role support enabled`);
  console.log(`✅ ALL routes ready including 4 Order tables`);
});

