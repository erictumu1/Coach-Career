import { integer, json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});

export const userHistoryTable = pgTable('historytable',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId:varchar().notNull(),
    content:json(),
    userEmail: varchar({ length: 255 }).references(() => usersTable.email),
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    AIAgentType: varchar(),
    metaData: varchar()
})