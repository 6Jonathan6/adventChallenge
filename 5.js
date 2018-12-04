const claims = require('./dataDay3.js')
class Claim {
    constructor(string) {
        const array = string.split(' ')
        this.id = Number(array[0].split('')[1])
        this.x = Number(array[1].split('')[1])
        this.y = Number(array[2].split('')[0])
        this.width = Number(array[3].split('x')[0])
        this.height = Number(array[3].split('x')[1])
    }
    get xLimit() {
        return this.x + this.width
    }
    get yLimit() {
        return this.y + this.height
    }
    get area() {
        return this.width * this.height
    }
    overlap(claim) {
        console.log(claim)
        if ((claim.x >= this.x && claim.x <= this.xLimit) && (claim.y >= this.y && claim.y <= this.yLimit)) {
            return true
        }
        return false
    }
}

const parsedClaims = claims.map((claim) => new Claim(claim))
const example1 = new Claim('#1 @1, 3: 4x4')
const example2 = new Claim('#2 @3, 1: 4x4')
console.log(example1.yLimit)
console.log(example1.overlap(example2))