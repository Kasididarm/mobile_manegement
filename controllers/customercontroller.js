const pool = require('../db');

// Customer -> all their mobile numbers (OWNS)
exports.customerNumbers = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM MOBILE_NUMBER WHERE Customer_ID = ?', [req.params.id]);
  res.json(rows);
};

// Customer -> all their bills (ISSUED)
exports.customerBills = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM BILL WHERE Customer_ID = ? ORDER BY Issue_date DESC', [req.params.id]);
  res.json(rows);
};
