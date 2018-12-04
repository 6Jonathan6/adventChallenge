const data = require('./dataDay4')

const example = ['[1518-11-01 00:00] Guard #10 begins shift', '[1518-11-01 00:05] falls asleep', '[1518-11-01 00:25] wakes up', '[1518-11-01 00:30] falls asleep', '[1518-11-01 00:55] wakes up', '[1518-11-01 23:58] Guard #99 begins shift', '[1518-11-02 00:40] falls asleep', '[1518-11-02 00:50] wakes up', '[1518-11-03 00:05] Guard #10 begins shift', '[1518-11-03 00:24] falls asleep', '[1518-11-03 00:29] wakes up', '[1518-11-04 00:02] Guard #99 begins shift', '[1518-11-04 00:36] falls asleep', '[1518-11-04 00:46] wakes up', '[1518-11-05 00:03] Guard #99 begins shift', '[1518-11-05 00:45] falls asleep', '[1518-11-05 00:55] wakes up']

function count(array) {
    const unique = Array.from(new Set(array))
    const cache = new Map()
    unique.forEach(item => {
        array.forEach(item2 => {
            if (item === item2) {
                if (cache.has(item)) {
                    const newValue = cache.get(item) + 1
                    cache.set(item, newValue)
                } else {
                    cache.set(item, 1)
                }
            }
        })
    })
    return cache
}
function getMostFrecuent(map) {
    let maxKey
    const max = Math.max(...Array.from(map.values()))
    map.forEach((value, key) => {
        if (value === max) {
            maxKey = key
        }
    })
    return maxKey
}


function getMinutesInterval(fallasleepMinutes, wakeUpMinutes) {
    if (fallasleepMinutes < wakeUpMinutes) {
        return new Array(wakeUpMinutes - fallasleepMinutes).fill(0).map((value, index) => {
            return fallasleepMinutes + index
        })
    } else if (fallasleepMinutes > wakeUpMinutes) {
        return [...getMinutesInterval(0, wakeUpMinutes), ...getMinutesInterval(fallasleepMinutes, 60)]
    }
}

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

function sleepMinutes(fallasleep, wakeUp) {
    return new Date(wakeUp - fallasleep).getMinutes()
}

function setTimes(sorted) {
    const map = new Map()
    let id
    sorted.forEach((item, index) => {
        if ('id' in item) {
            id = item.id
            if (sorted[index + 1].action === 'falls asleep') {
                const fallasleep = sorted.slice(index).find((item) => item.action === 'falls asleep')
                const wakeUp = sorted.slice(index).find((item) => item.action === 'wakes up')
                const minutesArray = getMinutesInterval(fallasleep.regystryDate.getUTCMinutes(), wakeUp.regystryDate.getUTCMinutes())
                const diffrence = sleepMinutes(fallasleep.regystryDate, wakeUp.regystryDate)
                if (map.has(id)) {
                    const newValue = diffrence + map.get(id).time
                    const newMinutes = [...map.get(id).minutes, ...minutesArray]
                    map.set(id, { time: newValue, minutes: newMinutes })
                } else {
                    map.set(id, { time: diffrence, minutes: minutesArray })
                }
            }
        } else {
            if (item.action == 'wakes up' && index < sorted.length - 2) {
                if (!('id' in sorted[index + 1])) {
                    const fallasleep = sorted.slice(index).find((item) => item.action === 'falls asleep')
                    const wakeUp = sorted.slice(index + 1).find((item) => item.action === 'wakes up')
                    const diffrence = sleepMinutes(fallasleep.regystryDate, wakeUp.regystryDate)
                    const minutesArray = getMinutesInterval(fallasleep.regystryDate.getUTCMinutes(), wakeUp.regystryDate.getUTCMinutes())
                    if (map.has(id)) {
                        const newValue = diffrence + map.get(id).time
                        const newMinutes = [...map.get(id).minutes, ...minutesArray]
                        map.set(id, { time: newValue, minutes: newMinutes })

                    } else {
                        map.set(id, { time: diffrence, minutes: minutesArray })
                    }
                }
            }
        }
    })
    return map
}

function composer(array) {
    const result = new Map()
    const map2 = new Map()
    const map = setTimes(array)
    const times = []
    map.forEach((obj, key) => {
        const mostFrequent = getMostFrecuent(count(obj.minutes))
        map2.set(key, { time: obj.time, mostFrequent })
    })
    map2.forEach((value, key) => {
        times.push(value.time)
    })
    const max = Math.max(...times)
    map2.forEach((value, key) => {
        if (value.time === max) {
            result.set(key, value)
        }
    })
    return result
}

const parsedExample = example.map(parser)
console.log(composer(parsed))
console.log(composer(parsedExample))

// console.log(setTimes(parsed))
