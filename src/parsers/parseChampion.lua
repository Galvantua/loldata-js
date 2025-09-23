package.path = package.path .. ";../outputCache/champions_lua/?.lua"
local requestedChampion = ""

for i, v in ipairs(args) do
	print(v)
	if i > 1 then
		requestedChampion = requestedChampion .. " "
		requestedChampion = requestedChampion .. v
	elseif i == 1 then
		requestedChampion = v
	end
end

local function parseChampion(champion)
	
end
print(requestedChampion)
parseChampion(requestedChampion)