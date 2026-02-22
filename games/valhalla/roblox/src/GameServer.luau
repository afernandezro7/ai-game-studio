--[[
    GameServer.luau — Main server script for Project Valhalla
    Location in Roblox: ServerScriptService/GameServer

    Handles:
    - Player data (load/save via DataStoreService)
    - Production tick loop (every 1 second)
    - RemoteEvent handling for client requests
    - Offline earnings calculation on join
]]

local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local ConfigLoader = require(game:GetService("ServerStorage").Valhalla.ConfigLoader)
local ProductionSystem = require(game:GetService("ServerStorage").Valhalla.ProductionSystem)
local BuildingSystem = require(game:GetService("ServerStorage").Valhalla.BuildingSystem)

-- DataStore for saving player progress
local playerStore = DataStoreService:GetDataStore("ValhallaPlayerData_v1")

-- RemoteEvents for client ↔ server communication
local remotes = Instance.new("Folder")
remotes.Name = "ValhallaRemotes"
remotes.Parent = ReplicatedStorage

local function createRemote(name: string, className: string)
    local remote = Instance.new(className)
    remote.Name = name
    remote.Parent = remotes
    return remote
end

local RequestUpgrade = createRemote("RequestUpgrade", "RemoteEvent")
local RequestSpeedUp = createRemote("RequestSpeedUp", "RemoteEvent")
local UpdateResources = createRemote("UpdateResources", "RemoteEvent")
local UpdateBuildings = createRemote("UpdateBuildings", "RemoteEvent")
local ShowOfflineEarnings = createRemote("ShowOfflineEarnings", "RemoteEvent")

-- Active player data (in-memory)
local activePlayers: { [number]: any } = {}

-- Initialize configs
ConfigLoader.Init()

--- Load player data from DataStore or create new
local function loadPlayerData(player: Player)
    local success, data = pcall(function()
        return playerStore:GetAsync("player_" .. player.UserId)
    end)

    if success and data then
        -- Calculate offline earnings
        local secondsAway = os.time() - (data.lastOnline or os.time())
        if secondsAway > 60 then -- Only if away > 1 min
            local woodEarned, steelEarned = ProductionSystem.CalculateOfflineEarnings(
                data.buildings, secondsAway
            )
            data.resources.wood_yggdrasil += woodEarned
            data.resources.steel_dwarf += steelEarned

            -- Cap to storage
            local maxWood, maxSteel = ProductionSystem.CalculateStorageCap(data.buildings)
            data.resources.wood_yggdrasil = math.min(data.resources.wood_yggdrasil, maxWood)
            data.resources.steel_dwarf = math.min(data.resources.steel_dwarf, maxSteel)

            -- Notify client about offline earnings
            if woodEarned > 1 or steelEarned > 1 then
                task.delay(2, function()
                    ShowOfflineEarnings:FireClient(player, {
                        wood = math.floor(woodEarned),
                        steel = math.floor(steelEarned),
                    })
                end)
            end
        end

        data.lastOnline = os.time()
        return data
    else
        return BuildingSystem.CreateNewPlayer()
    end
end

--- Save player data to DataStore
local function savePlayerData(player: Player)
    local data = activePlayers[player.UserId]
    if not data then return end

    data.lastOnline = os.time()

    local success, err = pcall(function()
        playerStore:SetAsync("player_" .. player.UserId, data)
    end)

    if not success then
        warn("[GameServer] Failed to save data for " .. player.Name .. ": " .. tostring(err))
    end
end

--- Send full state update to client
local function syncToClient(player: Player)
    local data = activePlayers[player.UserId]
    if not data then return end

    local woodRate, steelRate = ProductionSystem.CalculateTotalProduction(data.buildings)

    UpdateResources:FireClient(player, {
        resources = data.resources,
        woodPerHour = woodRate,
        steelPerHour = steelRate,
    })

    UpdateBuildings:FireClient(player, {
        buildings = data.buildings,
        upgrading = data.upgrading,
    })
end

-- === Player Connection ===

Players.PlayerAdded:Connect(function(player)
    local data = loadPlayerData(player)
    activePlayers[player.UserId] = data
    print("[GameServer] " .. player.Name .. " joined. Resources: " ..
        math.floor(data.resources.wood_yggdrasil) .. " wood, " ..
        math.floor(data.resources.steel_dwarf) .. " steel")
    syncToClient(player)
end)

Players.PlayerRemoving:Connect(function(player)
    savePlayerData(player)
    activePlayers[player.UserId] = nil
end)

-- === Remote Event Handlers ===

RequestUpgrade.OnServerEvent:Connect(function(player, buildingId)
    local data = activePlayers[player.UserId]
    if not data then return end

    local success, message = BuildingSystem.TryUpgrade(data, buildingId)
    if success then
        syncToClient(player)
    else
        warn("[GameServer] " .. player.Name .. " upgrade failed: " .. message)
    end
end)

RequestSpeedUp.OnServerEvent:Connect(function(player)
    local data = activePlayers[player.UserId]
    if not data then return end

    local success, message = BuildingSystem.TrySpeedUp(data)
    if success then
        syncToClient(player)
    end
end)

-- === Production Tick (every 1 second) ===

local tickAccumulator = 0

RunService.Heartbeat:Connect(function(dt)
    tickAccumulator += dt
    if tickAccumulator < 1 then return end
    tickAccumulator = 0

    for userId, data in activePlayers do
        -- Tick production
        local woodPerHour, steelPerHour = ProductionSystem.CalculateTotalProduction(data.buildings)
        local woodPerSecond = woodPerHour / 3600
        local steelPerSecond = steelPerHour / 3600

        local maxWood, maxSteel = ProductionSystem.CalculateStorageCap(data.buildings)
        data.resources.wood_yggdrasil = math.min(data.resources.wood_yggdrasil + woodPerSecond, maxWood)
        data.resources.steel_dwarf = math.min(data.resources.steel_dwarf + steelPerSecond, maxSteel)

        -- Check upgrade completion
        local completed = BuildingSystem.ProcessUpgrade(data)

        -- Sync to client
        local player = Players:GetPlayerByUserId(userId)
        if player then
            syncToClient(player)
        end
    end
end)

-- === Auto-save every 60 seconds ===

task.spawn(function()
    while true do
        task.wait(60)
        for userId, _ in activePlayers do
            local player = Players:GetPlayerByUserId(userId)
            if player then
                savePlayerData(player)
            end
        end
    end
end)

-- === Save all on server shutdown ===

game:BindToClose(function()
    for userId, _ in activePlayers do
        local player = Players:GetPlayerByUserId(userId)
        if player then
            savePlayerData(player)
        end
    end
end)

print("[GameServer] Valhalla server initialized!")
