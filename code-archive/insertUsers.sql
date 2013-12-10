/*
File Name: insertUsers.sql
Authors: Armagan Tekdoner and JingXuan He
Website: webforum.grifare.com
URI: http://webforum.grifare.com/code-archive/insertUsers.sql
File Description:
Inserts 10 dummy users into the users table, from within phpMyAdmin
They can login using the plain text passwords from the admin panel
Their roles are later set from the admin panel
*/


INSERT INTO wp_users(user_login, user_pass, user_nicename, user_email, display_name)
VALUES
-- plain text passwords are encrypted using MD5 
('user1', MD5('pw1'), 'user1', 'real_contributormail1@fakemail.ca', 'real_contributor1'),
('user2', MD5('pw2'), 'user2', 'real_contributormail2@fakemail.ca', 'real_contributor2'),
('user3', MD5('pw3'), 'user3', 'real_contributormail3@fakemail.ca', 'real_contributor3'),
('user4', MD5('pw4'), 'user4', 'real_contributormail4@fakemail.ca', 'real_contributor4'),
('user5', MD5('pw5'), 'user5', 'real_contributormail5@fakemail.ca', 'real_contributor5'),
('user6', MD5('pw6'), 'user6', 'real_contributormail6@fakemail.ca', 'real_contributor6'),
('user7', MD5('pw7'), 'user7', 'real_contributormail7@fakemail.ca', 'real_contributor7'),
('user8', MD5('pw8'), 'user8', 'real_contributormail8@fakemail.ca', 'real_contributor8'),
('user9', MD5('pw9'), 'user9', 'real_contributormail9@fakemail.ca', 'real_contributor9'),
('user10', MD5('pw10'), 'user10', 'real_contributormai10@fakemail.ca', 'real_contributor10')
;
