ALTER TABLE `generated_election_result` ADD `result` json NOT NULL;--> statement-breakpoint
ALTER TABLE `generated_election_result` DROP COLUMN `election`;