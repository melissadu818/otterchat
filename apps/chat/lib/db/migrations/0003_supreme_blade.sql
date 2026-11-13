CREATE TABLE "message_reaction" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message_reaction" ADD CONSTRAINT "message_reaction_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_message_reaction_unique" ON "message_reaction" USING btree ("chat_id","message_id","user_id","emoji");--> statement-breakpoint
CREATE INDEX "idx_message_reaction_chat_message" ON "message_reaction" USING btree ("chat_id","message_id");