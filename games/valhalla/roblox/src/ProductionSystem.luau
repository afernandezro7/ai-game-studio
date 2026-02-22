--[[
    ProductionSystem.luau — Resource production calculations
    Location in Roblox: ServerStorage/Valhalla/ProductionSystem

    Handles real-time and offline resource production.
    Pure logic — no UI dependencies.
]]

local ConfigLoader = require(script.Parent.ConfigLoader)

local ProductionSystem = {}
ProductionSystem.__index = ProductionSystem

--- Calculate total production rates for a player's buildings
--- Returns: woodPerHour, steelPerHour
function ProductionSystem.CalculateTotalProduction(playerBuildings: { [string]: number })
    local totalWood = 0
    local totalSteel = 0

    for buildingId, level in playerBuildings do
        if level <= 0 then continue end

        local levelData = ConfigLoader.GetBuildingLevel(buildingId, level)
        if not levelData then continue end

        -- Resource producers (lumber_mill, steel_mine)
        if levelData.productionRatePerHour then
            if buildingId == "lumber_mill" then
                totalWood += levelData.productionRatePerHour
            elseif buildingId == "steel_mine" then
                totalSteel += levelData.productionRatePerHour
            end
        end

        -- Great Hall passive production
        if levelData.passiveProduction then
            totalWood += (levelData.passiveProduction.wood_yggdrasil or 0)
            totalSteel += (levelData.passiveProduction.steel_dwarf or 0)
        end
    end

    return totalWood, totalSteel
end

--- Calculate resources earned while player was offline
--- Cap at 8 hours to prevent exploits
function ProductionSystem.CalculateOfflineEarnings(playerBuildings: { [string]: number }, secondsElapsed: number)
    local hoursElapsed = math.min(secondsElapsed / 3600, 8)
    if hoursElapsed <= 0 then return 0, 0 end

    local woodPerHour, steelPerHour = ProductionSystem.CalculateTotalProduction(playerBuildings)
    return woodPerHour * hoursElapsed, steelPerHour * hoursElapsed
end

--- Calculate max storage capacity across all buildings
function ProductionSystem.CalculateStorageCap(playerBuildings: { [string]: number })
    local maxWood = 0
    local maxSteel = 0

    for buildingId, level in playerBuildings do
        if level <= 0 then continue end

        local levelData = ConfigLoader.GetBuildingLevel(buildingId, level)
        if not levelData then continue end

        -- Great Hall storage
        if levelData.storage then
            maxWood += (levelData.storage.wood_yggdrasil or 0)
            maxSteel += (levelData.storage.steel_dwarf or 0)
        end

        -- Resource building internal storage
        if levelData.storageCapacity then
            if buildingId == "lumber_mill" then
                maxWood += levelData.storageCapacity
            elseif buildingId == "steel_mine" then
                maxSteel += levelData.storageCapacity
            end
        end
    end

    return maxWood, maxSteel
end

--- Check if player can afford a cost
function ProductionSystem.CanAfford(resources, cost)
    return resources.wood_yggdrasil >= (cost.wood_yggdrasil or 0)
        and resources.steel_dwarf >= (cost.steel_dwarf or 0)
end

return ProductionSystem
