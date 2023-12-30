CREATE TABLE `auction_image` (
	`id` varchar(256) NOT NULL,
	`image` json,
	`auction_id` varchar(256) NOT NULL,
	CONSTRAINT `auction_image_id` PRIMARY KEY(`id`),
	CONSTRAINT `election_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `auction` (
	`id` varchar(256) NOT NULL,
	`name` text NOT NULL,
	`description` longtext,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`bid_increment` decimal(2) NOT NULL DEFAULT '1',
	`highest_bid_id` varchar(256),
	`seller_id` varchar(256) NOT NULL,
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auction_id` PRIMARY KEY(`id`),
	CONSTRAINT `election_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `bid` (
	`id` varchar(256) NOT NULL,
	`amount` decimal(2) NOT NULL,
	`buyer_id` varchar(256) NOT NULL,
	`auction_id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bid_id` PRIMARY KEY(`id`),
	CONSTRAINT `election_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `buyer` (
	`id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `buyer_id` PRIMARY KEY(`id`),
	CONSTRAINT `election_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller` (
	`id` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	`user_id` varchar(256) NOT NULL,
	CONSTRAINT `seller_id` PRIMARY KEY(`id`),
	CONSTRAINT `election_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE INDEX `auctionImageId_idx` ON `auction_image` (`id`);--> statement-breakpoint
CREATE INDEX `auctionImageAuctionId_idx` ON `auction_image` (`auction_id`);--> statement-breakpoint
CREATE INDEX `auctionId_idx` ON `auction` (`id`);--> statement-breakpoint
CREATE INDEX `auctionStartDate_idx` ON `auction` (`start_date`);--> statement-breakpoint
CREATE INDEX `auctionEndDate_idx` ON `auction` (`end_date`);--> statement-breakpoint
CREATE INDEX `auctionDeletedAt_idx` ON `auction` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `auctionHighestBidId_idx` ON `auction` (`highest_bid_id`);--> statement-breakpoint
CREATE INDEX `auctionSellerId_idx` ON `auction` (`seller_id`);--> statement-breakpoint
CREATE INDEX `bidId_idx` ON `bid` (`id`);--> statement-breakpoint
CREATE INDEX `bidBuyerId_idx` ON `bid` (`buyer_id`);--> statement-breakpoint
CREATE INDEX `bidAuctionId_idx` ON `bid` (`auction_id`);--> statement-breakpoint
CREATE INDEX `buyerId_idx` ON `buyer` (`id`);--> statement-breakpoint
CREATE INDEX `buyerUserId_idx` ON `buyer` (`user_id`);--> statement-breakpoint
CREATE INDEX `buyerDeletedAt_idx` ON `buyer` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `sellerId_idx` ON `seller` (`id`);--> statement-breakpoint
CREATE INDEX `sellerUserId_idx` ON `seller` (`user_id`);--> statement-breakpoint
CREATE INDEX `sellerDeletedAt_idx` ON `seller` (`deleted_at`);