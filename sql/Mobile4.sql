USE Mobile;

DROP PROCEDURE IF EXISTS get_customer_details;
DROP PROCEDURE IF EXISTS create_subscription;
DROP PROCEDURE IF EXISTS cancel_subscription;

DELIMITER $$

CREATE PROCEDURE get_customer_details(
    IN p_customer_id INT
)
BEGIN
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        m.phone_number,
        m.status
    FROM customer c
    JOIN mobile_number m
        ON c.customer_id = m.customer_id
    WHERE c.customer_id = p_customer_id;
END$$


CREATE PROCEDURE create_subscription(
    IN p_subscription_id INT,
    IN p_plan_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME,
    IN p_phone_number VARCHAR(255)
)
BEGIN
    INSERT INTO subscription (
        subscription_id,
        plan_id,
        start_date,
        end_date,
        phone_number,
        status
    )
    VALUES (
        p_subscription_id,
        p_plan_id,
        p_start_date,
        p_end_date,
        p_phone_number,
        'Active'
    );
END$$


CREATE PROCEDURE cancel_subscription(
    IN p_subscription_id INT,
    IN p_end_date DATETIME
)
BEGIN
    UPDATE subscription
    SET
        status = 'Inactive',
        end_date = p_end_date
    WHERE subscription_id = p_subscription_id;
END$$

DELIMITER ;

START TRANSACTION;

INSERT INTO payment
(payment_id, bill_id, payment_date, amount)
VALUES
(3, 1002, '2026-11-13 17:30:00', 599);

UPDATE bill
SET status = 'Paid'
WHERE bill_id = 1002;

COMMIT;



-- test ระบบ

CALL get_customer_details(1);

-- ถ้าจะ create subscription 4 ต้องลบที่ insert ไว้ในไฟล์3ก่อน
DELETE FROM subscription
WHERE subscription_id = 4;
-- create subscription 4 ถ้า id อื่นเปลี่ยนที่ใส่ข้างใน
CALL create_subscription(
    4,
    102,
    '2026-11-13',
    '2027-11-13',
    '0812345678'
);
-- test ว่า create subscription แล้ว
SELECT *
FROM subscription
WHERE subscription_id = 4;

-- test payment
SELECT *
FROM payment
WHERE bill_id = 1002;

SELECT *
FROM bill
WHERE bill_id = 1002;

-- ยกเลิก subscription เปลี่ยน status เฉยๆ ไม่ได้ลบ subscription ถ้าจะลบให้ลบแบบด้านบน
CALL cancel_subscription(4, '2026-12-01');

-- แก้ transaction ลบใหม่ ถ้าจะเทสซ้ำ
DELETE FROM payment
WHERE payment_id = 3;

UPDATE bill
SET status = 'Unpaid'
WHERE bill_id = 1002;

