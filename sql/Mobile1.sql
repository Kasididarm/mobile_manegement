CREATE DATABASE IF NOT EXISTS Mobile;
USE Mobile;

CREATE table customer(
    customer_id int PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(255)
);
CREATE table service_plan(
    plan_id int PRIMARY KEY,
    plan_name VARCHAR(255),
    monthly_fee int,
    data_limit int,
    call_limit int
);

CREATE table mobile_number(
    phone_number VARCHAR(255) PRIMARY KEY,
    customer_id int,
    activation_date DATETIME,
    status VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE table bill(
    bill_id int PRIMARY KEY,
    customer_id int,
    billing_period DATETIME,
    issue_date DATETIME,
    due_Date DATETIME,
    total_Amount int,
    status VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE table sim_card(
    sim_id INT PRIMARY KEY,
    phone_number VARCHAR(255),
    sim_type VARCHAR(255),
    FOREIGN KEY (phone_number) REFERENCES mobile_number(phone_number)
);

CREATE table subscription(
    subscription_id int PRIMARY KEY,
    plan_id int,
    start_date DATETIME,
    end_date DATETIME,
    phone_number VARCHAR(255),
    status VARCHAR(255),
    FOREIGN KEY (Plan_id) REFERENCES service_plan(plan_id),
    FOREIGN KEY (phone_number) REFERENCES mobile_number(phone_number) 
);

CREATE table payment(
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT,
    payment_date DATETIME,
    amount int,
    payment_method VARCHAR(255)
);

DROP DATABASE Mobile;

CREATE DATABASE Mobile;
USE Mobile;

CREATE table Mobile_number(
    phone_number:VARCHAR(255),
    customer_id:int,
    Activation_date:DATETIME,
    Status:VARCHAR(255)
);
-- แก้ตารางให้ตรง controller
ALTER TABLE service_plan
RENAME COLUMN date_limit TO data_limit;

ALTER TABLE customer
MODIFY customer_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE subscription
MODIFY subscription_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE payment
MODIFY payment_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE mobile_number
DROP FOREIGN KEY mobile_number_ibfk_1;

ALTER TABLE bill
DROP FOREIGN KEY bill_ibfk_1;

ALTER TABLE customer
MODIFY customer_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE mobile_number
ADD CONSTRAINT fk_mobile_customer
FOREIGN KEY (customer_id)
REFERENCES customer(customer_id);

ALTER TABLE bill
ADD CONSTRAINT fk_bill_customer
FOREIGN KEY (customer_id)
REFERENCES customer(customer_id);
-- add
ALTER TABLE payment
ADD COLUMN payment_method VARCHAR(255);

