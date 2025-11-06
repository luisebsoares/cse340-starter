--query 1
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
SELECT *
FROM public.account --query 2
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
SELECT *
FROM public.account --query 3
DELETE FROM account
WHERE account_email = 'tony@starkent.com'
SELECT *
FROM public.account
SELECT *
FROM inventory
WHERE inv_make = 'GM';
--query 4
UPDATE inventory
SET inv_description = REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    and inv_model = 'Hummer';
SELECT *
FROM inventory
WHERE inv_make = 'GM';
--query 5
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
--query 6
UPDATE inventory
SET inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');
SELECT *
FROM inventory