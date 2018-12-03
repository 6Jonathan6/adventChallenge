const ids = require('./dataDay2.js')
const example = ['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']

function counter(string) {
    const cache = new Map()
    const array = string.split('')
    const set = new Set(array)
    if (set.size === array.length) {
        return 0
    }
    let letters = Array.from(set)
    letters.forEach(letter => {
        const regex = new RegExp(letter, 'g')
        const result = string.match(regex)
        cache.set(letter, result.length)
    })
    return cache
}

function getAllTwosAndThrees(map) {
    if (map === 0) {
        return 0
    }
    const values = Array.from(map.values())
    return values.filter((value) => value === 2 || value === 3)

}

function composer(string) {
    const map = counter(string)
    return getAllTwosAndThrees(map)
}

function checkSum(array) {
    let two = 0
    let three = 0
    const cache = new Map()
    array.forEach(string => {
        cache.set(string, composer(string))
    })
    const cacheValues = Array.from(cache.values())
        .filter((value) => value instanceof Array)
    cacheValues.forEach(array => {
        const hasTwo = array.find((value) => value === 2)
        const hasThree = array.find((value) => value === 3)
        if (hasThree === 3 && hasTwo === 2) {
            three += 1
            two += 1
        } else if (hasTwo === 2) {
            two += 1
        } else if (hasThree === 3) {
            three += 1

        }
    })
    return two * three
}
checkSum(ids)