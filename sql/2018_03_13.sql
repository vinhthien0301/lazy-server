ALTER TABLE `trAuthWebFrontEnd`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthFrontEnd`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trCardInfo`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trDownloadLink`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trLoadRig`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trRigConfig`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trRigEvent`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trRigSoftwareDownload`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trRunBatch`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trSocketMinerInfo`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trSocketMobileInfo`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trUser`
MODIFY COLUMN `updated_at` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `created_at` text COLLATE utf8_unicode_ci NOT NULL;


ALTER TABLE `trAuthRig`
ADD COLUMN `machine_id` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `arch` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `cpus` text COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `freemem` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `loadavg` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `public_ip` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `platform` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `release` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `totelmem` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `type` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `uptime` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `user_info` text COLLATE utf8_unicode_ci NOT NULL

ALTER TABLE `trAuthRig`
CHANGE COLUMN `totelmem` `totalmem` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
CHANGE COLUMN `release` `release_os` varchar(500) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trAuthRig`
ADD COLUMN `socket_id` text COLLATE utf8_unicode_ci NOT NULL;

DROP TABLE trSocketMinerInfo;

