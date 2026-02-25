-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "runes" INTEGER NOT NULL DEFAULT 50,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "map_x" INTEGER NOT NULL,
    "map_y" INTEGER NOT NULL,
    "population" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" UUID NOT NULL,
    "village_id" UUID NOT NULL,
    "wood" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "clay" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "iron" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "wheat" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" UUID NOT NULL,
    "village_id" UUID NOT NULL,
    "building_type" VARCHAR(30) NOT NULL,
    "slot_index" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "upgrade_finish_at" TIMESTAMP(3),

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "troops" (
    "id" UUID NOT NULL,
    "village_id" UUID NOT NULL,
    "troop_type" VARCHAR(30) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "training_finish_at" TIMESTAMP(3),

    CONSTRAINT "troops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL,
    "attacker_id" UUID NOT NULL,
    "origin_village" UUID NOT NULL,
    "target_village" UUID NOT NULL,
    "mission_type" VARCHAR(20) NOT NULL,
    "depart_at" TIMESTAMP(3) NOT NULL,
    "arrive_at" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'traveling',
    "battle_report_id" UUID,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_troops" (
    "id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "troop_type" VARCHAR(30) NOT NULL,
    "count_sent" INTEGER NOT NULL,
    "count_returned" INTEGER,

    CONSTRAINT "mission_troops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_reports" (
    "id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "winner" VARCHAR(10) NOT NULL,
    "attacker_atk" INTEGER NOT NULL,
    "defender_def" INTEGER NOT NULL,
    "loot" JSONB NOT NULL DEFAULT '{}',
    "attacker_losses" JSONB NOT NULL DEFAULT '{}',
    "defender_losses" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_cells" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "cell_type" VARCHAR(20) NOT NULL DEFAULT 'empty',
    "village_id" UUID,
    "oasis_type" VARCHAR(30),

    CONSTRAINT "map_cells_pkey" PRIMARY KEY ("x","y")
);

-- CreateTable
CREATE TABLE "alliances" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "tag" VARCHAR(4) NOT NULL,
    "description" VARCHAR(500) NOT NULL DEFAULT '',
    "leader_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alliances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alliance_members" (
    "alliance_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'karl',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alliance_members_pkey" PRIMARY KEY ("alliance_id","user_id")
);

-- CreateTable
CREATE TABLE "diplomacy" (
    "alliance_a_id" UUID NOT NULL,
    "alliance_b_id" UUID NOT NULL,
    "state" VARCHAR(20) NOT NULL DEFAULT 'neutral',
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diplomacy_pkey" PRIMARY KEY ("alliance_a_id","alliance_b_id")
);

-- CreateTable
CREATE TABLE "oasis_claims" (
    "oasis_x" INTEGER NOT NULL,
    "oasis_y" INTEGER NOT NULL,
    "village_id" UUID NOT NULL,
    "oasis_type" VARCHAR(30) NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oasis_claims_pkey" PRIMARY KEY ("oasis_x","oasis_y")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "villages_owner_id_idx" ON "villages"("owner_id");

-- CreateIndex
CREATE INDEX "villages_map_x_map_y_idx" ON "villages"("map_x", "map_y");

-- CreateIndex
CREATE UNIQUE INDEX "resources_village_id_key" ON "resources"("village_id");

-- CreateIndex
CREATE INDEX "buildings_village_id_idx" ON "buildings"("village_id");

-- CreateIndex
CREATE INDEX "troops_village_id_idx" ON "troops"("village_id");

-- CreateIndex
CREATE UNIQUE INDEX "missions_battle_report_id_key" ON "missions"("battle_report_id");

-- CreateIndex
CREATE INDEX "missions_attacker_id_idx" ON "missions"("attacker_id");

-- CreateIndex
CREATE INDEX "missions_status_arrive_at_idx" ON "missions"("status", "arrive_at");

-- CreateIndex
CREATE INDEX "mission_troops_mission_id_idx" ON "mission_troops"("mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "battle_reports_mission_id_key" ON "battle_reports"("mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "map_cells_village_id_key" ON "map_cells"("village_id");

-- CreateIndex
CREATE INDEX "map_cells_cell_type_idx" ON "map_cells"("cell_type");

-- CreateIndex
CREATE UNIQUE INDEX "alliances_name_key" ON "alliances"("name");

-- CreateIndex
CREATE UNIQUE INDEX "alliances_tag_key" ON "alliances"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "alliance_members_user_id_key" ON "alliance_members"("user_id");

-- CreateIndex
CREATE INDEX "oasis_claims_village_id_idx" ON "oasis_claims"("village_id");

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "troops" ADD CONSTRAINT "troops_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_attacker_id_fkey" FOREIGN KEY ("attacker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_origin_village_fkey" FOREIGN KEY ("origin_village") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_target_village_fkey" FOREIGN KEY ("target_village") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_troops" ADD CONSTRAINT "mission_troops_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_reports" ADD CONSTRAINT "battle_reports_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_cells" ADD CONSTRAINT "map_cells_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alliances" ADD CONSTRAINT "alliances_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alliance_members" ADD CONSTRAINT "alliance_members_alliance_id_fkey" FOREIGN KEY ("alliance_id") REFERENCES "alliances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alliance_members" ADD CONSTRAINT "alliance_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diplomacy" ADD CONSTRAINT "diplomacy_alliance_a_id_fkey" FOREIGN KEY ("alliance_a_id") REFERENCES "alliances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diplomacy" ADD CONSTRAINT "diplomacy_alliance_b_id_fkey" FOREIGN KEY ("alliance_b_id") REFERENCES "alliances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oasis_claims" ADD CONSTRAINT "oasis_claims_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oasis_claims" ADD CONSTRAINT "oasis_claims_oasis_x_oasis_y_fkey" FOREIGN KEY ("oasis_x", "oasis_y") REFERENCES "map_cells"("x", "y") ON DELETE RESTRICT ON UPDATE CASCADE;
