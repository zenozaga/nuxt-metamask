function has (obj:unknown, key:string) : boolean {
    if (typeof obj === 'object' && !(obj instanceof Array)) {
        return Object.prototype.hasOwnProperty.call(obj, key)
    } else if (typeof obj === 'object' && obj instanceof Array) {
        return obj.filter(item => item === key).length > 0
    }

    return false
}

function get (object:unknown, key:string) : unknown {
    if (typeof object === 'object' && has(object, key)) {
        return object ? object[key] : null
    }

    return null
}

function assing (target:unknown, key:string|null, source:unknown) : unknown {
    if (typeof target === 'object' && typeof source === 'object') {
        if (key) {
            return { ...target, [key]: source }
        } else {
            return { ...target, ...source }
        }
    }

    return null
}

export {
    has,
    get,
    assing
}
