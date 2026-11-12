USE Mobile;
INSERT INTO customer(customer_id,first_name,last_name,email,status)
VALUES (1,'sponge','bob','squarepant@gmail.com','active'),
(2,'sailor','moon','sailormoon@gmail.com','active'),
(3,'peter','parker','spiderman@gmail.com','inactive'),(4,'dora','emon','dorayaki@gmail.com','inactive');

INSERT INTO service_plan(plan_id, plan_name, monthly_fee, date_limit, call_limit)
VALUES (101, 'Basic', 299, 20, 100),(102, 'Standard', 599, 50, 300),(103, 'Unlimited', 899, 100, 1000);


INSERT INTO mobile_number(phone_number, customer_id, activation_date, status)
VALUES
('0812345678', 1, '2026-01-15 10:00:00', 'Active'),
('0898765432', 2, '2026-02-10 09:30:00', 'Active'),
('0861112233', 3, '2026-03-01 11:00:00', 'Inactive');

INSERT INTO sim_card(sim_id, phone_number, sim_type)
VALUES
(1, '0812345678', 'Physical SIM'),
(2, '0898765432', 'ESIM'),
(3, '0861112233', 'Physical SIM');

INSERT INTO subscription
(subscription_id, plan_id, start_date, end_date, phone_number, status)
VALUES
(1, 101, '2026-01-15 00:00:00', '2027-01-15 00:00:00',
 '0812345678', 'Active'),

(2, 102, '2026-02-10 00:00:00', '2027-02-10 00:00:00',
 '0898765432', 'Active'),

(3, 103, '2026-03-01 00:00:00', '2027-03-01 00:00:00',
 '0861112233', 'Inactive');

 INSERT INTO bill
(bill_id, customer_id, billing_period, issue_date, due_date, total_amount, status)
VALUES
(1001, 1, '2026-10-01 00:00:00',
 '2026-11-01 08:00:00', '2026-11-15 23:59:59',
 299, 'Paid'),

(1002, 2, '2026-10-01 00:00:00',
 '2026-11-01 08:00:00', '2026-11-15 23:59:59',
 599, 'Unpaid'),

(1003, 3, '2026-10-01 00:00:00',
 '2026-11-01 08:00:00', '2026-11-15 23:59:59',
 899, 'Paid');

 INSERT INTO payment
(payment_id, bill_id, payment_date, amount)
VALUES
(1, 1001, '2026-11-05 13:30:00', 299),
(2, 1003, '2026-11-07 16:45:00', 899);


