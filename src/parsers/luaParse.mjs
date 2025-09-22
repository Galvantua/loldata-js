const luaToJson = (luaTable) => {
    return luaTable
		.replace(/&amp;/g, '&') // Decode HTML entities
        .replace(/\[\"(.*)\"\]\s*\=/g, '"$1":') // Convert keys to JSON format
		.replace(/\[\d*\]\s*\=\s*/g, '')      // Remove array indices
		.replace(/\{\n\s*\".*\"\,/g, '[') // Replace beginning of multiline arrays
        .replace(/\{\"/g, '["')             // Replace `{` with `[`
        .replace(/\"\}/g, '"]')             // Replace `}` with `]`
		.replace(/\,\s*\n\s*\}/g, '\n}') // Handle trailing commas before closing braces
		.replace(/\,\}/g, ']')
		.replace(/--.*$/gm, '') // Remove comments
		.replace(/"\n\}/g, '"\n]') // Handle multiline arrays without trailing commas
		.replace(/(\s*"hp_lvl": )(.*),/g, '$1"$2",') // Ensure hp_lvl values are strings
}

export default luaToJson;