const example = ['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz']
const ids = require('./dataDay2.js')

function getNumberOfDifferences(string1, string2) {
    const array1 = string1.split('')
    const array2 = string2.split('')
    let differences = 0
    array1.forEach((letter, index) => {
        const letter2 = array2[index]
        if (letter2 !== letter) {
            differences += 1
        }
    })
    return differences
}

function getIDsWithOneDifference(array) {
    const oneDifference = []
    array.forEach((string) => {
        array.forEach((string2) => {
            const differences = getNumberOfDifferences(string, string2)
            if (differences === 1) {
                oneDifference.push(string)
            }
        })
    })
    return oneDifference
}

function removeDifferentLetters(array) {
    const array1 = array[0].split('')
    const array2 = array[1].split('')
    return array1.filter(letter => {
        return array2.includes(letter)
    })
}
function composer(array) {
    const result = getIDsWithOneDifference(array)
    return removeDifferentLetters(result)
}
// console.log(getNumberOfDifferences('fghij', 'fguij'))

// console.log(composer(ids))
console.log(composer(ids).join(''))