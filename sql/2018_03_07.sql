ALTER TABLE `trAuthFrontEnd`
ADD COLUMN `app_version` varchar(100) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthFrontEnd`
ADD COLUMN `device_platform` varchar(100) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthFrontEnd`
ADD COLUMN `device_model` varchar(100) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthFrontEnd`
ADD COLUMN `device_version` varchar(100) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trAuthFrontEnd`
ADD COLUMN `device_uuid` varchar(100) COLLATE utf8_unicode_ci NULL;