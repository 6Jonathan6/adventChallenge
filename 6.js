const data = require('./dataDay4')

function parser(item) {
    const array = item.split(' ')
    const date = array[0].replace('[', '')
    const time = array[1].replace(']', '')
    const regystryDate = new Date(`${date}T${time}Z`)
    const action = array.slice(2).join(' ')
    let id
    if (action.includes('#')) {
        id = action.split(' ')[1].replace('#', '')
        return { regystryDate, id }
    }
    return { regystryDate, action }
}
const parsed = data.map(parser)
const sorted = parsed.sort((a, b) => {
    return a.regystryDate - b.regystryDate
})

function setTimes(sorted) {
    const map = new Map()
    const shifts = sorted.filter(item => 'id' in item)
    shifts.forEach((shift) => {
        map.set(shift.id, {
            indexes: shifts.filter((item) => item.id === shift.id)
        })
    })
    console.log(shifts.findIndex(item => item === map.get('587').indexes[1]))
}


setTimes(sorted)