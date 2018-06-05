
ALTER TABLE `trDownloadLink`
MODIFY COLUMN `download_link` text COLLATE utf8_unicode_ci NOT NULL,
MODIFY COLUMN `filename` text COLLATE utf8_unicode_ci NOT NULL;

UPDATE `trDownloadLink`
SET `software` = 'CLAYMORE',
    `version` = '9.7',
    `download_link` = 'http://download608.mediafire.com/gsjj0rvfb4ng/6o8dzhrpflbkwg7/Claymore%5C%27s+Dual+Ethereum+Decred_Siacoin_Lbry_Pascal+AMD+NVIDIA+GPU+Miner+v9.7.zip',
    `filename` = 'Claymore\'s Dual Ethereum+Decred_Siacoin_Lbry_Pascal AMD+NVIDIA GPU Miner v9.7',
    `latest` = 1
WHERE `id` = 1;

