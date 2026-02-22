--[[
    ConfigLoader.luau — Loads JSON configs for Project Valhalla
    Location in Roblox: ServerStorage/Valhalla/ConfigLoader

    This module reads the BuildingsConfig and ResourcesConfig
    and provides typed access to game data.
]]

local HttpService = game:GetService("HttpService")

local ConfigLoader = {}
ConfigLoader.__index = ConfigLoader

-- Store loaded configs
local buildingsConfig = nil
local resourcesConfig = nil

--- Load configs from JSON strings stored in StringValue objects
--- Place your JSON as StringValues under ServerStorage/GameConfig/
function ConfigLoader.Init()
    local configFolder = game:GetService("ServerStorage"):FindFirstChild("GameConfig")
    if not configFolder then
        warn("[ConfigLoader] ServerStorage/GameConfig folder not found!")
        return false
    end

    -- Load Buildings
    local buildingsValue = configFolder:FindFirstChild("BuildingsConfig")
    if buildingsValue and buildingsValue:IsA("StringValue") then
        local success, data = pcall(function()
            return HttpService:JSONDecode(buildingsValue.Value)
        end)
        if success then
            buildingsConfig = data
            print("[ConfigLoader] Loaded " .. #data.buildings .. " buildings")
        else
            warn("[ConfigLoader] Failed to parse BuildingsConfig: " .. tostring(data))
        end
    end

    -- Load Resources
    local resourcesValue = configFolder:FindFirstChild("ResourcesConfig")
    if resourcesValue and resourcesValue:IsA("StringValue") then
        local success, data = pcall(function()
            return HttpService:JSONDecode(resourcesValue.Value)
        end)
        if success then
            resourcesConfig = data
            print("[ConfigLoader] Loaded " .. #data.resources .. " resource types")
        else
            warn("[ConfigLoader] Failed to parse ResourcesConfig: " .. tostring(data))
        end
    end

    return true
end

--- Get the full buildings config
function ConfigLoader.GetBuildings()
    return buildingsConfig
end

--- Get the full resources config
function ConfigLoader.GetResources()
    return resourcesConfig
end

--- Get a building definition by ID
function ConfigLoader.GetBuilding(buildingId: string)
    if not buildingsConfig then return nil end
    for _, building in buildingsConfig.buildings do
        if building.id == buildingId then
            return building
        end
    end
    warn("[ConfigLoader] Building '" .. buildingId .. "' not found")
    return nil
end

--- Get a specific level config for a building
function ConfigLoader.GetBuildingLevel(buildingId: string, level: number)
    local building = ConfigLoader.GetBuilding(buildingId)
    if not building then return nil end
    for _, lvl in building.levels do
        if lvl.level == level then
            return lvl
        end
    end
    warn("[ConfigLoader] Building '" .. buildingId .. "' level " .. level .. " not found")
    return nil
end

--- Get initial resources for a new player
function ConfigLoader.GetInitialResources()
    if not resourcesConfig then return nil end
    return resourcesConfig.initialResources
end

return ConfigLoader
