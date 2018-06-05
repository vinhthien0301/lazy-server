
ALTER TABLE trRigConfig
ADD COLUMN `platform` varchar(200) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'WINDOWS';

ALTER TABLE trRigConfig
ADD COLUMN `version` varchar(200) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE trRunBatch
DROP COLUMN `version`;

ALTER TABLE trRunBatch
DROP COLUMN `download_link`;

ALTER TABLE trRunBatch
DROP COLUMN `filename`;

UPDATE `trRunBatch` SET `software` = '1';

