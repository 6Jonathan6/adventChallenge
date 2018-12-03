const frequencies = require('./dataDay1.js')
const example = [+1, -2, +3, +1]



function duplicatedF(array, map, result) {
    let duplicated = false
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        result += element
        if (map.has(result)) {
            duplicated = result
            break
        } else {
            map.set(result, 1)
        }
    }
    return { duplicated, result }
}

function iterator(array, map, result) {
    let obj = duplicatedF(array, map, result)
    const duplicated = obj.duplicated
    let lastResult = obj.result
    if (!duplicated) {
        return iterator(array, map, lastResult)
    } else {
        return duplicated
    }
}

const map = new Map()
map.set(0, 1)
const duplicated = iterator(frequencies, map, 0)
console.log(duplicated)