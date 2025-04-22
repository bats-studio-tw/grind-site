CREATE TABLE `items` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50),
	`slot` varchar(20),
	`type` int DEFAULT 0,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_equipments` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(42) NOT NULL,
	`slot` varchar(20) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	`equipped_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_equipments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_items` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(42) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	`obtained_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(42) NOT NULL,
	`user_name` varchar(50),
	`character` int DEFAULT 0,
	`clicked_count` int DEFAULT 0,
	`remaining_gift_box` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
