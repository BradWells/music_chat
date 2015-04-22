# Be Your Own DJ
Be Your Own DJ is a web-based application to allow friends to listen to music with each other at the same time.

One friend, the DJ, creates a "channel" to play music on. After that, he provides list of links to valid music streaming locations, such as MP3 files online or YouTube links. A playlist of songs is generated for him to start and stop. The DJ can switch songs, skip to the middle of a song, and add additional songs to the playlist.

His friends can join the DJ's channel by visiting the link given to them by the DJ. When they visit the page, Be Your Own DJ will sync all of the listeners to the current location of the DJ in the song. That way, all of the listeners will be listening to the same part of a song at the same time.

Currently, the audio URL's that are supported are:
 - Links directly to HTML5-supported audio files (.ogg, .aac, .mp4, .wav, .webm)
 - Links directly to HTML5-supported audio files (.ogg, .mp4, .webm)
 - Links directly to YouTube videos

## Project and Source Code Information
Be Your Own DJ is an open-source project written in Javascript, JQuery, and PHP.  

The project was originally created for a project at Iowa State University for ComS 486, Computer Networking.

## Installation

### Requirements
 - A machine running Linux (preferably Debian or Ubuntu)

### Setting up a LAMP server
Follow the instructions on the following link to set up a LAMP server:
https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu

### Setting up MySQL
Next, you must create the MySQL tables.  Copy and paste the following code into a MySQL shell:

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
	INDEX `FK_channels_tracks` (`current_track`)
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
	INDEX `FK__channels` (`channel_id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=6;
```
