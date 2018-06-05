ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `app_code_name` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `app_name` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `app_version` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `platform` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `product` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `product_sub` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `user_agent` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `vendor` varchar(500) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthWebFrontEnd`
ADD COLUMN `ip_address` varchar(100) COLLATE utf8_unicode_ci NULL;