const express = require('express');
const router = express.Router();

const crud = require('../controllers/crud');
const customerRelations = require('../controllers/customercontroller');
const mobileNumber = require('../controllers/mobileNumberController');
const bill = require('../controllers/billController');
const payment = require('../controllers/paymentcontroller');
const servicePlan = require('../controllers/serviceplancontroller');
const subscription = require('../controllers/subscriptioncontroller');

// ========================
// CUSTOMER CRUD
// ========================

const customer = crud(
    'CUSTOMER',
    'Customer_ID',
    ['First_name', 'Last_name', 'Email', 'Status']
);

router.get('/customers', customer.list);
router.get('/customers/:id', customer.get);
router.post('/customers', customer.create);
router.put('/customers/:id', customer.update);
router.delete('/customers/:id', customer.remove);

// Customer -> Mobile Numbers
router.get(
    '/customers/:id/numbers',
    customerRelations.customerNumbers
);

// Customer -> Bills
router.get(
    '/customers/:id/bills',
    customerRelations.customerBills
);

// ========================
// MOBILE NUMBER
// ========================

router.get(
    '/mobile-numbers/:id/details',
    mobileNumber.details
);

// ========================
// SERVICE PLAN
// ========================

router.get('/service-plans', servicePlan.list);

// ========================
// SUBSCRIPTION
// ========================

router.get('/subscriptions', subscription.list);
router.post('/subscriptions', subscription.create);
router.put('/subscriptions/:id', subscription.update);
router.delete('/subscriptions/:id', subscription.remove);

// ========================
// BILL / PAYMENT
// ========================

router.get('/bills/:id/payments', bill.payments);

router.post('/payments/pay', payment.pay);

module.exports = router;