const polymer = 'dabAcCaCBAcCcaDA'
const fs = require('fs')
const file = fs.readFileSync('./data', 'utf8')
const data = file.replace(new RegExp('\n', 'g'), '')


function getReactions(string) {
    let newString = string
    const array = string.split('')
    const reactions = []
    array.forEach((letter, index) => {
        if (letter.toLowerCase() === letter) {
            if (array[index + 1] === letter.toUpperCase()) {
                reactions.push(`${letter}${array[index + 1]}`)
            }

        } else {
            if (array[index + 1] === letter.toLowerCase()) {
                reactions.push(`${letter}${array[index + 1]}`)
            }
        }
    })
    if (reactions.length === 0) {
        return string
    }
    reactions.forEach(reaction => {
        newString = newString.replace(reaction, '')
    })
    return getReactions(newString)
}


// ------Part 2 ----------
function removingElements(string) {
    const array = string.split('')
    const uniques = Array.from(new Set(array))
    const cache = new Map()
    uniques.forEach(unique => {
        if (!cache.has(unique.toLowerCase())) {
            const upper = unique.toUpperCase()
            const lower = unique.toLowerCase()
            const withoutUpper = string.replace(new RegExp(upper, 'g'), '')
            const withoutAny = withoutUpper.replace(new RegExp(lower, 'g'), '')
            cache.set(unique.toLowerCase(), getReactions(withoutAny).length)
        }
    })
    return cache
}
function getMin(map) {
    return Math.min(...Array.from(map.values()))
}

console.log(getMin(removingElements(data)))
// console.log(getReactions(data).length)