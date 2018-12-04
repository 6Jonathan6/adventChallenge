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
}

console.log(new Claim(claims[1000]))