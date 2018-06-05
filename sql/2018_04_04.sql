ALTER TABLE `trRigEvent`
ADD COLUMN `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL;


ALTER TABLE `trRigEvent`
ADD COLUMN `machine_name` varchar(200) COLLATE utf8_unicode_ci NOT NULL;