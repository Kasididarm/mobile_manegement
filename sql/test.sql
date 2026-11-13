USE Mobile;

SELECT * FROM subscription;

SELECT * FROM sim_card;

SELECT *
FROM subscription
WHERE subscription_id IN (5, 6);

DELETE FROM subscription
WHERE subscription_id IN (5, 6);

SELECT *
FROM subscription
WHERE phone_number = '0813459800';

SELECT *
FROM sim_card
WHERE phone_number = '0813459800';

DESCRIBE sim_card;

