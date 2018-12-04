const claims = require('./data1.js')
// const example = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2']
const example = ["#1 @ 1,3: 4x4", "#2 @ 3,1: 4x4", "#3 @ 5,5: 2x2"]

function range(start, final) {
    const size = final - start
    return new Array(size).fill(0).map((value, index) => {
        return index + start
    })
}
class Claim {
    constructor(string) {
        const array = string.split(' ')
        this.id = Number(array[0].replace('#', ''))
        this.x = Number(array[2].split(',')[0])
        this.y = Number(array[2].split(',')[1].replace(':', ''))
        this.width = Number(array[3].split('x')[0])
        this.height = Number(array[3].split('x')[1])
    }
    get xLimit() {
        return this.x + this.width - 1
    }
    get yLimit() {
        return this.y + this.height - 1
    }
    get xRange() {
        const final = this.xLimit + 1
        return range(this.x, final)
    }
    get yRange() {
        const final = this.yLimit + 1
        return range(this.y, final)
    }
    get points() {
        const array = []
        this.xRange.forEach(xcoord => {
            this.yRange.forEach(ycoord => {
                array.push([xcoord, ycoord])
            })
        })
        return array
    }
}

function parse(array) {
    return array.map(value => new Claim(value))
}

function mapPoints(claims) {
    const map = new Map()
    const array = []
    claims.forEach(claim => {
        claim.points.forEach(point => {
            array.push(point)
            const stringPoint = JSON.stringify(point)
            if (map.has(stringPoint)) {
                let newValue = map.get(stringPoint).value + 1
                map.set(stringPoint, { value: newValue, id: claim.id })
            } else {
                map.set(stringPoint, { value: 1, id: claim.id })
            }
        })
    })
    return map
}

function sumPoints(map) {
    let count = 0
    let noSharedPoints = new Map()
    map.forEach((value, key) => {
        if (value.value > 1) {
            count += 1
        } else {
            if (noSharedPoints.has(value.id)) {
                const array = noSharedPoints.get(value.id)
                noSharedPoints.set(value.id, [...array, key])
            } else {
                noSharedPoints.set(value.id, [key])
            }
        }
    })
    return { count, noSharedPoints }
}

function composer(claims) {
    const map = mapPoints(claims)
    const { count, noSharedPoints } = sumPoints(map)
    const arrayNosharedPoints = Array.from(noSharedPoints.keys())
    let uniqueClaim
    arrayNosharedPoints.forEach(id => {
        const claim = claims.find(claim => claim.id === id)
        const pointsLength = noSharedPoints.get(id).length
        if (claim.points.length === pointsLength) {
            uniqueClaim = claim
        }
    })
    return { count: count, uniqueClaim }
}


const parsed = parse(claims)
const { count, uniqueClaim } = composer(parsed)
console.log('Shared', count)
console.log('Unique', uniqueClaim)
// console.log(getUniqueClaim(parsed))