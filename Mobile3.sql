USE Mobile;
-- ดูข้อมูล customer ปัจจุบัน
SELECT c.customer_id, 
    c.first_name,
    c.last_name,
    m.phone_number,
    m.status,
    sp.plan_name,
    sp.monthly_fee
FROM customer c 
JOIN mobile_number m ON c.customer_id = m.customer_id
JOIN subscription s ON m.phone_number = s.phone_number
JOIN service_plan sp ON s.plan_id = sp.plan_id
WHERE c.customer_id = 1;

SELECT COUNT(*) AS total_mobile_numbers FROM mobile_number;

-- ดู service plan ที่ให้เลือก
SELECT
    plan_id,
    plan_name,
    monthly_fee,
    data_limit,
    call_limit
FROM service_plan;

-- เลือกเบอร์ลูกค้าไปสมัคร
SELECT phone_number,status
FROM mobile_number
WHERE customer_id = 1;
-- สมัคร subscription
INSERT INTO subscription
(
    subscription_id,
    plan_id,
    start_date,
    end_date,
    phone_number,
    status
)
VALUES
(
    4,
    102,
    '2026-11-13 00:00:00',
    '2027-11-13 00:00:00',
    '0812345678',
    'Active'
);
-- เช็คผล subscription
SELECT
    s.subscription_id,
    s.phone_number,
    sp.plan_name,
    sp.monthly_fee,
    s.start_date,
    s.end_date,
    s.status
FROM subscription s
JOIN service_plan sp ON s.plan_id = sp.plan_id
WHERE s.subscription_id = 4;

-- UPDATE ยกเลิก subscription
UPDATE subscription 
SET status = 'Inactive', end_date = '2026-12-01'
WHERE subscription_id = 4;

SELECT *
FROM subscription
WHERE subscription_id = 4;
-- ลบ subscription
DELETE FROM subscription
WHERE subscription_id = 4;
