ALTER TABLE `trLoadRig`
ADD COLUMN `desired_version` varchar(200) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trLoadRig`
ADD COLUMN `desired_feed_url` varchar(500) COLLATE utf8_unicode_ci NOT NULL ;

