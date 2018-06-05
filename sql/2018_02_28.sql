
ALTER TABLE trDownloadLink
ADD COLUMN `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL ;


ALTER TABLE trDownloadLink DROP PRIMARY KEY, ADD PRIMARY KEY(id, software, version,name);

