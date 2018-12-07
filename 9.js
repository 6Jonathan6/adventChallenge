const example = [
    'Step C must be finished before step A can begin.',
    'Step A must be finished before step B can begin.',
    'Step C must be finished before step F can begin.',
    'Step A must be finished before step D can begin.',
    'Step B must be finished before step E can begin.',
    'Step D must be finished before step E can begin.',
    'Step F must be finished before step E can begin.'
]

const data = require('./dataDay7.js')
function getNumberOfSteps(map) {
    const uniques = new Set()
    map.forEach((value, key) => {
        uniques.add(key)
        value.nextSteps.forEach(step => {
            uniques.add(step)
        })
        value.previousSteps.forEach(step => {
            if (step) {
                uniques.add(step)
            }
        })
    })
    return uniques.size
}

function parser(string) {
    const array = string.split(' ')
    const step = array[1]
    const nextStep = array[7]
    return { step, nextStep }
}

function getSteps(steps) {
    const map = new Map()
    steps.forEach(step => {
        const parsedStep = parser(step)
        if (map.has(parsedStep.step)) {
            const nextSteps = [...map.get(parsedStep.step).nextSteps, parsedStep.nextStep].sort()
            map.set(parsedStep.step, { nextSteps })
        } else {
            map.set(parsedStep.step, { nextSteps: [parsedStep.nextStep] })
        }
    })
    return map
}
function addPreviousSteps(step, map) {
    const previousSteps = []
    map.forEach((value, key) => {
        if (key !== step) {
            if (value.nextSteps.includes(step)) {
                previousSteps.push(key)
            }
        }
    })
    const oldValue = map.get(step)
    map.set(step, { ...oldValue, ...{ previousSteps } })
}

function addPreviousStepsAll(map) {
    const steps = Array.from(map.keys())
    steps.forEach(step => {
        addPreviousSteps(step, map)
    })
    return map
}
function updateMap(doneStep, map) {
    const nextSteps = map.get(doneStep).nextSteps
    nextSteps.forEach(nextStep => {
        if (map.has(nextStep)) {
            const value = map.get(nextStep)
            const oldPreviousSteps = value.previousSteps
            const indexOfNextStep = oldPreviousSteps.indexOf(doneStep)
            const newPreviusStep = [...oldPreviousSteps.slice(0, indexOfNextStep), ...oldPreviousSteps.slice(indexOfNextStep + 1)]
            map.set(nextStep, { ...value, ...{ previousSteps: newPreviusStep } })
        }

    })
    map.delete(doneStep)

}
function getAvailableStep(map) {
    const firstSteps = []
    map.forEach((value, key) => {
        if (value.previousSteps.length === 0) {
            firstSteps.push(key)
        }
    })
    if (firstSteps.length !== 0) {
        const step = firstSteps.sort()[0]
        console.log('updating', step)
        updateMap(step, map)
    }
    console.log(firstSteps)
    return firstSteps.sort()[0]
}



function runTime(stepsMap, results = [], numberOfSteps) {
    if (numberOfSteps === results.length || stepsMap.size === 0) return results.join('')
    const newResults = [...results, ...getAvailableStep(stepsMap)]
    return runTime(stepsMap, newResults, numberOfSteps)
}

function getLastStep(array) {
    const uniquesNext = array.map(text => text.split(' ')[7])
    const uniquesStep = array.map(text => text.split(' ')[1])
    const lastStep = uniquesNext.filter(nextS => !uniquesStep.includes(nextS))
    return lastStep[0]
}
// const stepsMap = addPreviousStepsAll(getSteps(data))
// const lastStep = getLastStep(data)
// console.log(getNumberOfSteps(stepsMap))
// console.log(runTime(stepsMap, [], getNumberOfSteps(stepsMap)) + lastStep)

// Part 2
function getLetterTime(letter, coords, period) {
    const map = addPreviousStepsAll(getSteps(coords))
    const letters = getLetters(map)
    return letters.findIndex((le) => le === letter) !== -1 ? letters.findIndex((le) => le === letter) + 1 + period : null
}

function getLetters(map) {
    const uniques = new Set()
    map.forEach((value, key) => {
        uniques.add(key)
        value.nextSteps.forEach(step => {
            uniques.add(step)
        })
        value.previousSteps.forEach(step => {
            if (step) {
                uniques.add(step)
            }
        })
    })
    return Array.from(uniques).sort()
}


function getAvailableSteps(map, workers) {
    const firstSteps = []
    map.forEach((value, key) => {
        if (value.previousSteps.length === 0) {
            firstSteps.push(key)
        }
    })
    if (firstSteps.length !== 0) {
        if (firstSteps.length > workers) {
            const steps = firstSteps.sort().slice(0, workers + 1)
            steps.forEach(step => {
                updateMap(step, map)
            })
            return steps
        } else {
            const steps = firstSteps.sort()
            steps.forEach(step => {
                updateMap(step, map)
            })
            return steps
        }

    }
}
const mapExample = addPreviousStepsAll(getSteps(example))

function parallelWorking(mapOfSteps, numberOfWorkers, originalArray, period, arrayOfWorkers) {
    if (mapOfSteps.size === 0) return arrayOfWorkers
    let arrayW = arrayOfWorkers.length === 0 ? [] : arrayOfWorkers
    const doneSteps = getAvailableSteps(mapOfSteps, numberOfWorkers)
    let timesAndSteps = []
    doneSteps.forEach((step) => {
        const time = getLetterTime(step, originalArray, period)
        timesAndSteps.push({ step, time })
    })
    arrayW = [...arrayW, timesAndSteps]
    return parallelWorking(mapOfSteps, numberOfWorkers, originalArray, period, arrayW)

}
console.log(parallelWorking(mapExample, 2, example, 0, []))