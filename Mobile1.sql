USE Mobile;

CREATE table sim_card(
    Sim_id INT,
    phone_number:INT,
    Sim_type VARCHAR(255),


);
CREATE table payment(
    Bill_id:INT,
    payment_date:DATETIME,
    Amount:int,
);
CREATE table BIil(
    Bill_id:int,
    customer_id:int,
    Billing_period:DATETIME,
    Issue_date:DATETIME,
    Due_Date:DATETIME,
    Total_Amount:int,
    Status:VARCHAR(255)
);
CREATE table customer(
    customer_id:int,
    First_name:VARCHAR(255),
    Last_name:VARCHAR(255),
    Email:VARCHAR(255),
    Status:VARCHAR(255)
);
CREATE table Service_plan(
    plan_id:int,
    Plan_name:DATETIME,
    Monthly_fee:int,
    Date_limit:int,
    Call_limit:int
);
CREATE table Subscription(
    Psubscription_id:int,
    Plan_id:int,
    Start_date:DATETIME,
    End_date:DATETIME,
    phone_number:VARCHAR(255),
    Staus:VARCHAR(255)
);
CREATE table Mobile_number(
    phone_number:VARCHAR(255),
    customer_id:int,
    Activation_date:DATETIME,
    Status:VARCHAR(255)
)