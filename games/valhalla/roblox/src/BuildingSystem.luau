--[[
    BuildingSystem.luau — Building placement and upgrade logic
    Location in Roblox: ServerStorage/Valhalla/BuildingSystem

    Manages the building lifecycle: validation, cost deduction,
    timer tracking, and completion.
]]

local ConfigLoader = require(script.Parent.ConfigLoader)
local ProductionSystem = require(script.Parent.ProductionSystem)

local BuildingSystem = {}
BuildingSystem.__index = BuildingSystem

--- Try to start upgrading a building
--- Returns: success (bool), message (string)
function BuildingSystem.TryUpgrade(playerData, buildingId: string)
    local currentLevel = playerData.buildings[buildingId] or 0

    -- Find next level config
    local nextLevelData = ConfigLoader.GetBuildingLevel(buildingId, currentLevel + 1)
    if not nextLevelData then
        return false, "Max level reached"
    end

    -- Check if already upgrading something
    if playerData.upgrading and playerData.upgrading.buildingId then
        return false, "Already upgrading " .. playerData.upgrading.buildingId
    end

    -- Check affordability
    if not ProductionSystem.CanAfford(playerData.resources, nextLevelData.cost) then
        return false, "Not enough resources"
    end

    -- Deduct resources
    playerData.resources.wood_yggdrasil -= (nextLevelData.cost.wood_yggdrasil or 0)
    playerData.resources.steel_dwarf -= (nextLevelData.cost.steel_dwarf or 0)

    -- Start upgrade timer
    playerData.upgrading = {
        buildingId = buildingId,
        targetLevel = currentLevel + 1,
        startTime = os.time(),
        durationSeconds = nextLevelData.buildTimeMin * 60,
    }

    print("[BuildingSystem] Started upgrading '" .. buildingId .. "' to level " .. (currentLevel + 1))
    return true, "Upgrade started"
end

--- Check if current upgrade is complete and apply it
function BuildingSystem.ProcessUpgrade(playerData)
    if not playerData.upgrading or not playerData.upgrading.buildingId then
        return nil
    end

    local elapsed = os.time() - playerData.upgrading.startTime
    if elapsed >= playerData.upgrading.durationSeconds then
        local buildingId = playerData.upgrading.buildingId
        local newLevel = playerData.upgrading.targetLevel

        playerData.buildings[buildingId] = newLevel
        playerData.upgrading = {}

        print("[BuildingSystem] '" .. buildingId .. "' upgraded to level " .. newLevel .. "!")
        return buildingId
    end

    return nil
end

--- Get remaining upgrade time in seconds
function BuildingSystem.GetRemainingTime(playerData)
    if not playerData.upgrading or not playerData.upgrading.buildingId then
        return 0
    end

    local elapsed = os.time() - playerData.upgrading.startTime
    local remaining = playerData.upgrading.durationSeconds - elapsed
    return math.max(0, remaining)
end

--- Speed up upgrade with Runes (1 Rune = 1 minute)
function BuildingSystem.TrySpeedUp(playerData)
    local remaining = BuildingSystem.GetRemainingTime(playerData)
    if remaining <= 0 then return false, "Nothing to speed up" end

    local runesCost = math.ceil(remaining / 60)
    if playerData.resources.runes < runesCost then
        return false, "Not enough runes (" .. playerData.resources.runes .. "/" .. runesCost .. ")"
    end

    playerData.resources.runes -= runesCost
    playerData.buildings[playerData.upgrading.buildingId] = playerData.upgrading.targetLevel
    playerData.upgrading = {}

    return true, "Speed up complete for " .. runesCost .. " runes"
end

--- Create a new player data table with initial values
function BuildingSystem.CreateNewPlayer()
    local initial = ConfigLoader.GetInitialResources()
    return {
        resources = {
            wood_yggdrasil = initial.wood_yggdrasil,
            steel_dwarf = initial.steel_dwarf,
            runes = initial.runes,
        },
        buildings = {
            great_hall = 1,
            lumber_mill = 1,
            steel_mine = 1,
        },
        upgrading = {},
        lastOnline = os.time(),
    }
end

return BuildingSystem
