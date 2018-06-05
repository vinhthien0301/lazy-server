ALTER TABLE trLoadRig
ADD COLUMN `warning_message` varchar(100) COLLATE utf8_unicode_ci NOT NULL

ALTER TABLE trLoadRig
ADD COLUMN `machine_id` varchar(200) COLLATE utf8_unicode_ci NOT NULL

ALTER TABLE trLoadRig
ADD COLUMN `public_ip` varchar(100) COLLATE utf8_unicode_ci NOT NULL