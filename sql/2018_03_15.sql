ALTER TABLE `trRigConfig`
ADD COLUMN `runbatch_id` int(11) NOT NULL;

ALTER TABLE `trUser`
ADD COLUMN `reset_password_token` varchar(200) NOT NULL;