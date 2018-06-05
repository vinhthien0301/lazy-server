ALTER TABLE `trDownloadLink`
ADD COLUMN `config_download_link` varchar(200) COLLATE utf8_unicode_ci NULL;

ALTER TABLE `trDownloadLink`
ADD COLUMN `config_filename` varchar(200) COLLATE utf8_unicode_ci NULL;

UPDATE `trDownloadLink` SET `config_download_link` = 'https://raw.githubusercontent.com/vinhthien0301/lazy-desktop/master/configs/xmrstak-monero-config.txt', `config_filename` = 'config.txt' WHERE `trDownloadLink`.`id` = 3 AND `trDownloadLink`.`software` = 'XMR-STAK' AND `trDownloadLink`.`version` = '2.2.0' AND `trDownloadLink`.`name` = 'XMR-Stak';