

ALTER TABLE trSocketMobileInfo
ADD COLUMN `cordova` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `model` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `platform` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `version` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `manufacturer` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `isVirtual` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trSocketMobileInfo
ADD COLUMN `serial` varchar(100) COLLATE utf8_unicode_ci NOT NULL;





