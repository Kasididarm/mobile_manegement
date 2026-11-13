const pool = require('../db');
const crud = require('./crud');

module.exports = {
  ...crud('BILL', 'Bill_ID',
    ['Customer_ID', 'Billing_period', 'Issue_date', 'Due_date', 'Total_amount', 'Status']),

  // GET /bills/:id/payments  -> payments + remaining balance
  async payments(req, res) {
    const [[bill]] = await pool.query('SELECT * FROM BILL WHERE Bill_ID = ?', [req.params.id]);
    if (!bill) return res.status(404).json({ error: 'BILL not found' });
    const [payments] = await pool.query('SELECT * FROM PAYMENT WHERE Bill_ID = ?', [req.params.id]);
    const paid = payments.reduce((s, p) => s + p.Amount, 0);
    res.json({ bill, payments, paid, remaining: Math.max(bill.Total_amount - paid, 0) });
  }
};
