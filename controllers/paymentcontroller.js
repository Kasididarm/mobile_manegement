const pool = require('../db');
const crud = require('./crud');

module.exports = {
  ...crud('PAYMENT', 'Payment_ID', ['Bill_ID', 'Payment_date', 'Amount', 'Payment_method']),

  // POST /payments/pay  -> insert payment + update bill status in one transaction
  async pay(req, res) {
    const { Bill_ID, Amount, Payment_method } = req.body;
    if (!Bill_ID || !Amount || Amount <= 0)
      return res.status(400).json({ error: 'Bill_ID and a positive Amount are required' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [[bill]] = await conn.query('SELECT * FROM BILL WHERE Bill_ID = ? FOR UPDATE', [Bill_ID]);
      if (!bill) { await conn.rollback(); return res.status(404).json({ error: 'BILL not found' }); }

      const [r] = await conn.query(
        'INSERT INTO PAYMENT (Bill_ID, Amount, Payment_method) VALUES (?,?,?)',
        [Bill_ID, Amount, Payment_method || null]);
      const [[{ paid }]] = await conn.query(
        'SELECT COALESCE(SUM(Amount),0) AS paid FROM PAYMENT WHERE Bill_ID = ?', [Bill_ID]);
      const status = paid >= bill.Total_amount ? 'Paid' : 'Partially Paid';
      await conn.query('UPDATE BILL SET Status = ? WHERE Bill_ID = ?', [status, Bill_ID]);
      await conn.commit();
      res.status(201).json({ Payment_ID: r.insertId, Bill_ID, paid, bill_status: status });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }
};
