const example =
    [
        [1, 1],
        [1, 6],
        [8, 3],
        [3, 4],
        [5, 5],
        [8, 9],
    ]
const data = require('./dataDay6')
function getMdistance(coord1, coord2) {
    const xDistance = Math.abs(coord1[0] - coord2[0])
    const yDistance = Math.abs(coord1[1] - coord2[1])
    return xDistance + yDistance
}

function furthestPoint(coords) {
    const x = Math.max(...coords.map(c => c[0]))
    const y = Math.max(...coords.map(c => c[1]))
    return [x, y]
}
function closestPoint(coords) {
    const x = Math.min(...coords.map(c => c[0]))
    const y = Math.min(...coords.map(c => c[1]))
    return [x, y]
}
function getInfinitePoints(coords) {
    const closestP = closestPoint(coords)
    const furthestP = furthestPoint(coords)
    console.log('Closest', closestP)
    console.log('Furthest', furthestP)
    const infinitePoints = coords.filter(coord => {
        if (coord[0] === closestP[0]) {
            return true
        }
        if (coord[1] === closestP[1]) {
            return true
        }
        if (coord[0] === furthestP[0]) {
            return true
        }
        if (coord[1] === furthestP[1]) {
            return true
        }
    })
    return infinitePoints
}

function getFinitePoints(coords) {
    const infiniteP = getInfinitePoints(coords).map(coord => JSON.stringify(coord))
    return coords.filter(coord => {
        const string = JSON.stringify(coord)
        return !infiniteP.includes(string)

    })
}

function findClosestPointToApoint(point, points) {
    const map = new Map()
    let result = []
    points.forEach(p => {

        map.set(p, getMdistance(point, p))
    })
    const minDistance = Math.min(...Array.from(map.values()))
    map.forEach((value, key) => {
        if (value === minDistance) {
            result.push(key)
        }
    })
    return result
}
function generatePoints(point1, point2, offset = 0) {
    let points = []
    for (let row = point1[0] - offset; row < point2[0] + offset + 1; row++) {
        for (let column = point1[1] - offset; column < point2[1] + offset + 1; column++) {
            points.push([row, column])

        }
    }
    return points
}

function removeDataInput(points, coords) {
    const coordString = coords.map(c => JSON.stringify(c))
    const poinstString = points.map(p => JSON.stringify(p))
    const newPoints = poinstString.filter(point => {
        return (!coordString.includes(point))
    })
    return newPoints.map(p => JSON.parse(p))
}

function generateGrid(coords, offset = 0) {
    const result = new Map()
    const start = closestPoint(coords)
    const final = furthestPoint(coords)
    const points = generatePoints(start, final, offset)
    const newPoints = removeDataInput(points, coords)
    newPoints.forEach(point => {
        const closest = findClosestPointToApoint(point, coords)
        if (closest.length === 1) {
            if (result.has(closest[0])) {
                const newValue = result.get(closest[0]) + 1
                result.set(closest[0], newValue)
            } else {
                result.set(closest[0], 1)
            }
        }
    })
    console.log(result)
    return result
}

function getMaximumFiniteArea(coords, offset) {
    const finitePoints = getFinitePoints(coords).map(p => JSON.stringify(p))
    const values = new Map()
    const map = generateGrid(coords, offset)
    map.forEach((value, key) => {
        if (finitePoints.includes(JSON.stringify(key))) {
            values.set(key, value)
        }
    })
    return values
}

const map1 = getMaximumFiniteArea(data, 0)

//A bigger grid in order to find new Infinite points those that change its area
const map2 = getMaximumFiniteArea(data, 40)
const noChanged = []
map1.forEach((value, key) => {
    if (map2.get(key) === value) {
        noChanged.push(value)
    }
})
//Part1
console.log('Part1', Math.max(...noChanged) + 1)

//Part2
function getAllDistancesFromApoint(point, coords, limit) {
    let distance = 0
    coords.forEach(coord => {
        distance += getMdistance(point, coord)
    })
    if (distance < limit) {
        return true
    }
    return false
}
function getSafeRegionSize(coords, limit) {
    const points = generatePoints(closestPoint(coords), furthestPoint(coords), 0)
    let size = 0
    points.forEach(point => {
        const distance = getAllDistancesFromApoint(point, coords, limit)
        if (distance) {
            size += 1
        }
    })
    return size
}

console.log('Part2', getSafeRegionSize(data, 10000))