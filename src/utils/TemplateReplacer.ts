const templateReplacer = (template: string, data: Record<string, string>): string => {
    return template.replace(/\$([a-zA-Z0-9_]+)\$/g, (match, key) => {
        const k = key.replace(/^\$/, '').replace(/^\$/, '')
        if (k in data) return data[key]
        return match
    })
}

export default templateReplacer
