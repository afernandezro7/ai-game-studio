--[[
    GameClient.luau — Client-side UI controller for Project Valhalla
    Location in Roblox: StarterPlayerScripts/GameClient

    Handles:
    - Displaying resources and production rates
    - Building cards with upgrade buttons
    - Upgrade timers and speed-up
    - Offline earnings popup
    - All game logic runs on SERVER — client only renders
]]

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- Wait for remotes
local remotes = ReplicatedStorage:WaitForChild("ValhallaRemotes")
local RequestUpgrade = remotes:WaitForChild("RequestUpgrade")
local RequestSpeedUp = remotes:WaitForChild("RequestSpeedUp")
local UpdateResources = remotes:WaitForChild("UpdateResources")
local UpdateBuildings = remotes:WaitForChild("UpdateBuildings")
local ShowOfflineEarnings = remotes:WaitForChild("ShowOfflineEarnings")

-- === Create UI ===

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "ValhallaUI"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

-- Resource Bar (top of screen)
local resourceBar = Instance.new("Frame")
resourceBar.Name = "ResourceBar"
resourceBar.Size = UDim2.new(1, 0, 0, 60)
resourceBar.Position = UDim2.new(0, 0, 0, 0)
resourceBar.BackgroundColor3 = Color3.fromHex("#1a1a2e")
resourceBar.BorderSizePixel = 0
resourceBar.Parent = screenGui

local resourceLayout = Instance.new("UIListLayout")
resourceLayout.FillDirection = Enum.FillDirection.Horizontal
resourceLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
resourceLayout.VerticalAlignment = Enum.VerticalAlignment.Center
resourceLayout.Padding = UDim.new(0, 30)
resourceLayout.Parent = resourceBar

-- Resource display labels
local resourceLabels = {}

local function createResourceDisplay(name: string, emoji: string, color: string)
    local frame = Instance.new("Frame")
    frame.Name = name
    frame.Size = UDim2.new(0, 200, 0, 50)
    frame.BackgroundTransparency = 1
    frame.Parent = resourceBar

    local label = Instance.new("TextLabel")
    label.Name = "Amount"
    label.Size = UDim2.new(1, 0, 0.6, 0)
    label.Position = UDim2.new(0, 0, 0, 0)
    label.BackgroundTransparency = 1
    label.TextColor3 = Color3.fromHex(color)
    label.TextSize = 22
    label.Font = Enum.Font.GothamBold
    label.Text = emoji .. " 0"
    label.Parent = frame

    local rate = Instance.new("TextLabel")
    rate.Name = "Rate"
    rate.Size = UDim2.new(1, 0, 0.4, 0)
    rate.Position = UDim2.new(0, 0, 0.6, 0)
    rate.BackgroundTransparency = 1
    rate.TextColor3 = Color3.fromHex("#888888")
    rate.TextSize = 14
    rate.Font = Enum.Font.Gotham
    rate.Text = "+0/h"
    rate.Parent = frame

    resourceLabels[name] = { amount = label, rate = rate, emoji = emoji }
    return frame
end

createResourceDisplay("wood", "🪵", "#D2691E")
createResourceDisplay("steel", "⛏️", "#B0C4DE")
createResourceDisplay("runes", "💎", "#9370DB")

-- Buildings area (bottom)
local buildingsFrame = Instance.new("ScrollingFrame")
buildingsFrame.Name = "Buildings"
buildingsFrame.Size = UDim2.new(1, -20, 0, 300)
buildingsFrame.Position = UDim2.new(0, 10, 1, -310)
buildingsFrame.BackgroundColor3 = Color3.fromHex("#16213e")
buildingsFrame.BackgroundTransparency = 0.3
buildingsFrame.BorderSizePixel = 0
buildingsFrame.ScrollBarThickness = 4
buildingsFrame.CanvasSize = UDim2.new(0, 1000, 0, 0)
buildingsFrame.ScrollingDirection = Enum.ScrollingDirection.X
buildingsFrame.Parent = screenGui

local buildingsLayout = Instance.new("UIListLayout")
buildingsLayout.FillDirection = Enum.FillDirection.Horizontal
buildingsLayout.Padding = UDim.new(0, 15)
buildingsLayout.VerticalAlignment = Enum.VerticalAlignment.Center
buildingsLayout.Parent = buildingsFrame

local buildingsCorner = Instance.new("UICorner")
buildingsCorner.CornerRadius = UDim.new(0, 12)
buildingsCorner.Parent = buildingsFrame

-- Building card storage
local buildingCards = {}

local BUILDING_NAMES = {
    great_hall = "🏛️ Gran Salón",
    lumber_mill = "🪓 Aserradero",
    steel_mine = "⛏️ Mina de Acero",
}

local function createBuildingCard(buildingId: string)
    local card = Instance.new("Frame")
    card.Name = buildingId
    card.Size = UDim2.new(0, 250, 0, 260)
    card.BackgroundColor3 = Color3.fromHex("#0f3460")
    card.BorderSizePixel = 0
    card.Parent = buildingsFrame

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 10)
    corner.Parent = card

    -- Building name
    local nameLabel = Instance.new("TextLabel")
    nameLabel.Size = UDim2.new(1, -10, 0, 30)
    nameLabel.Position = UDim2.new(0, 5, 0, 10)
    nameLabel.BackgroundTransparency = 1
    nameLabel.TextColor3 = Color3.fromHex("#DAA520")
    nameLabel.TextSize = 18
    nameLabel.Font = Enum.Font.GothamBold
    nameLabel.Text = BUILDING_NAMES[buildingId] or buildingId
    nameLabel.TextXAlignment = Enum.TextXAlignment.Left
    nameLabel.Parent = card

    -- Level
    local levelLabel = Instance.new("TextLabel")
    levelLabel.Name = "Level"
    levelLabel.Size = UDim2.new(1, -10, 0, 25)
    levelLabel.Position = UDim2.new(0, 5, 0, 45)
    levelLabel.BackgroundTransparency = 1
    levelLabel.TextColor3 = Color3.fromHex("#FFFFFF")
    levelLabel.TextSize = 16
    levelLabel.Font = Enum.Font.Gotham
    levelLabel.Text = "Nivel 0"
    levelLabel.TextXAlignment = Enum.TextXAlignment.Left
    levelLabel.Parent = card

    -- Production info
    local prodLabel = Instance.new("TextLabel")
    prodLabel.Name = "Production"
    prodLabel.Size = UDim2.new(1, -10, 0, 20)
    prodLabel.Position = UDim2.new(0, 5, 0, 75)
    prodLabel.BackgroundTransparency = 1
    prodLabel.TextColor3 = Color3.fromHex("#228B22")
    prodLabel.TextSize = 14
    prodLabel.Font = Enum.Font.Gotham
    prodLabel.Text = ""
    prodLabel.TextXAlignment = Enum.TextXAlignment.Left
    prodLabel.Parent = card

    -- Timer label (hidden by default)
    local timerLabel = Instance.new("TextLabel")
    timerLabel.Name = "Timer"
    timerLabel.Size = UDim2.new(1, -20, 0, 30)
    timerLabel.Position = UDim2.new(0, 10, 0, 160)
    timerLabel.BackgroundTransparency = 1
    timerLabel.TextColor3 = Color3.fromHex("#FF4500")
    timerLabel.TextSize = 16
    timerLabel.Font = Enum.Font.GothamBold
    timerLabel.Text = ""
    timerLabel.Visible = false
    timerLabel.Parent = card

    -- Upgrade button
    local button = Instance.new("TextButton")
    button.Name = "UpgradeBtn"
    button.Size = UDim2.new(1, -20, 0, 45)
    button.Position = UDim2.new(0, 10, 1, -55)
    button.BackgroundColor3 = Color3.fromHex("#4CAF50")
    button.TextColor3 = Color3.new(1, 1, 1)
    button.TextSize = 14
    button.Font = Enum.Font.GothamBold
    button.Text = "Mejorar"
    button.Parent = card

    local btnCorner = Instance.new("UICorner")
    btnCorner.CornerRadius = UDim.new(0, 8)
    btnCorner.Parent = button

    button.MouseButton1Click:Connect(function()
        RequestUpgrade:FireServer(buildingId)
    end)

    buildingCards[buildingId] = {
        card = card,
        level = levelLabel,
        production = prodLabel,
        button = button,
        timer = timerLabel,
    }
end

-- Create cards for initial buildings
for _, id in { "great_hall", "lumber_mill", "steel_mine" } do
    createBuildingCard(id)
end

-- === Update Handlers ===

UpdateResources.OnClientEvent:Connect(function(data)
    local r = data.resources

    resourceLabels.wood.amount.Text = resourceLabels.wood.emoji .. " " .. math.floor(r.wood_yggdrasil)
    resourceLabels.steel.amount.Text = resourceLabels.steel.emoji .. " " .. math.floor(r.steel_dwarf)
    resourceLabels.runes.amount.Text = resourceLabels.runes.emoji .. " " .. r.runes

    resourceLabels.wood.rate.Text = "+" .. math.floor(data.woodPerHour) .. "/h"
    resourceLabels.steel.rate.Text = "+" .. math.floor(data.steelPerHour) .. "/h"
    resourceLabels.runes.rate.Text = "" -- Runes don't produce
end)

UpdateBuildings.OnClientEvent:Connect(function(data)
    for buildingId, level in data.buildings do
        local card = buildingCards[buildingId]
        if card then
            card.level.Text = "Nivel " .. level
        end
    end

    -- Show upgrade timer if active
    if data.upgrading and data.upgrading.buildingId then
        local card = buildingCards[data.upgrading.buildingId]
        if card then
            card.timer.Visible = true
            local remaining = data.upgrading.durationSeconds - (os.time() - data.upgrading.startTime)
            remaining = math.max(0, remaining)
            local mins = math.floor(remaining / 60)
            local secs = remaining % 60
            card.timer.Text = string.format("⏱️ %02d:%02d", mins, secs)
        end
    else
        -- Hide all timers
        for _, card in buildingCards do
            card.timer.Visible = false
        end
    end
end)

-- Offline earnings popup
ShowOfflineEarnings.OnClientEvent:Connect(function(data)
    -- Simple notification
    local notification = Instance.new("Frame")
    notification.Size = UDim2.new(0, 350, 0, 150)
    notification.Position = UDim2.new(0.5, -175, 0.4, 0)
    notification.BackgroundColor3 = Color3.fromHex("#1a1a2e")
    notification.BorderSizePixel = 2
    notification.BorderColor3 = Color3.fromHex("#DAA520")
    notification.Parent = screenGui

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 12)
    corner.Parent = notification

    local title = Instance.new("TextLabel")
    title.Size = UDim2.new(1, 0, 0, 30)
    title.Position = UDim2.new(0, 0, 0, 10)
    title.BackgroundTransparency = 1
    title.TextColor3 = Color3.fromHex("#DAA520")
    title.TextSize = 18
    title.Font = Enum.Font.GothamBold
    title.Text = "🛡️ Welcome back, Jarl!"
    title.Parent = notification

    local earnings = Instance.new("TextLabel")
    earnings.Size = UDim2.new(1, 0, 0, 40)
    earnings.Position = UDim2.new(0, 0, 0, 45)
    earnings.BackgroundTransparency = 1
    earnings.TextColor3 = Color3.new(1, 1, 1)
    earnings.TextSize = 16
    earnings.Font = Enum.Font.Gotham
    earnings.Text = "🪵 +" .. data.wood .. "  ⛏️ +" .. data.steel
    earnings.Parent = notification

    local closeBtn = Instance.new("TextButton")
    closeBtn.Size = UDim2.new(0.6, 0, 0, 35)
    closeBtn.Position = UDim2.new(0.2, 0, 1, -45)
    closeBtn.BackgroundColor3 = Color3.fromHex("#4CAF50")
    closeBtn.TextColor3 = Color3.new(1, 1, 1)
    closeBtn.TextSize = 16
    closeBtn.Font = Enum.Font.GothamBold
    closeBtn.Text = "Reclamar"
    closeBtn.Parent = notification

    local btnCorner = Instance.new("UICorner")
    btnCorner.CornerRadius = UDim.new(0, 8)
    btnCorner.Parent = closeBtn

    closeBtn.MouseButton1Click:Connect(function()
        notification:Destroy()
    end)

    -- Auto-close after 10 seconds
    task.delay(10, function()
        if notification.Parent then
            notification:Destroy()
        end
    end)
end)

print("[GameClient] Valhalla UI initialized!")
