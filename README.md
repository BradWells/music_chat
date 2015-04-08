# music_chat
ComS 486 project

#### channels table
```mysql
CREATE TABLE `channels` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL DEFAULT '0',
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`current_track` INT(11) NULL DEFAULT NULL,
	`current_position` DOUBLE NULL DEFAULT NULL,
	`current_update` DATETIME NULL DEFAULT NULL,
	`current_status` ENUM('PLAY','PAUSE','NEW','GONE') NOT NULL DEFAULT 'NEW',
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name` (`name`),
	INDEX `FK_channels_tracks` (`current_track`),
	CONSTRAINT `FK_channels_tracks` FOREIGN KEY (`current_track`) REFERENCES `tracks` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=15;
```

#### tracks table 
```mysql
CREATE TABLE `tracks` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`number` INT(11) NOT NULL DEFAULT '0',
	`url` VARCHAR(200) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`channel_id` INT(11) NOT NULL,
	`type` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	INDEX `FK__channels` (`channel_id`),
	CONSTRAINT `FK__channels` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=6;
```
