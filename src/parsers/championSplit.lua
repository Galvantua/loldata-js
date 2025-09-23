package.path = package.path .. ";../outputCache/?.lua"
local champions = require("championsData")

-- Create a function to stringify a table
local function tableToString(tbl)
	local result = "{\n"
	for k, v in pairs(tbl) do
		if type(v) == "string" then
			result = result .. string.format('  ["%s"] = "%s",\n', k, v)
		elseif type(v) == "number" then
			result = result .. string.format('  ["%s"] = %s,\n', k, v)
		elseif type(v) == "nil" then
			result = result .. string.format('  ["%s"] = nil,\n', k)
		elseif type(v) == "table" then
			result = result .. string.format('  ["%s"] = %s,\n', k, tableToString(v))
		end
	end
	result = result .. "}"
	return result
end

local keys = ''
for key, value in pairs(champions) do
	local file = io.open("../outputCache/champions_lua/" .. key .. ".lua", "w")
    if not file then
		error("Could not open file for writing: " .. "../outputCache/champtions_lua/" .. key .. ".lua")
	end

	file:write("return " .. tableToString(value) .. "\n")
	file:close()

	keys = keys .. '"' .. key .. '",\n'
end

print(keys)