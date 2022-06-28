const models = require('./models')
const { zadd, zrevrange, exists, expireElement, zincrby } = require('./redis')


function processResult(amount) {
    if (amount === 10) {
        return {
            success: false,
            error: 'Bank transfer failed'
        }
    }
    return {
        success: true,
        message: 'Bank transfer successful'
    }
}

const BANK_TRANSFER_PROCESSORS_SET_NAME = 'bankTF_processorList'

// Function that calls an imaginary paystack integration
function paystackBT(amount) {
    return processResult(amount)
}

// Function that calls an imaginary stripe integration
function stripeBT(amount) {
    return processResult(amount)
}

// Function that calls an imaginary monify integration
function monifyBT(amount) {
    return processResult(amount)
}

// General function that calls processor function based on the processor
function processBankTransfer(processor, amount) {
    if (processor === 'paystack') {
        return paystackBT(amount)
    }
    if (processor === 'stripe') {
        return stripeBT(amount)
    }
    if (processor === 'monify') {
        return monifyBT(amount)
    }
}

// Main function
async function transferToBank(amount) {
    // await expire(BANK_TRANSFER_PROCESSORS_SET_NAME, 0)
    const processors = await models.bank_transfer_processors.findAll({ where: { enabled: true }, raw: true })
    const setArray = []
    const setExists = await exists(BANK_TRANSFER_PROCESSORS_SET_NAME)
    console.log(setArray)

    if (!setExists) {
        processors.forEach((processor) => {
            let score = 0
            if (processor.position === 1) {
                score = 30
            }
            if (processor.position === 2) {
                score = 10
            }
            setArray.push(score)
            setArray.push(processor.name)
        })
        await zadd(BANK_TRANSFER_PROCESSORS_SET_NAME, setArray)
        await expireElement(BANK_TRANSFER_PROCESSORS_SET_NAME, 1800)
    }
    const processorList = await zrevrange(BANK_TRANSFER_PROCESSORS_SET_NAME, 0, -1, 'WITHSCORES')
    console.log(processorList)
    const [highestScoredProcessor] = processorList
    console.log(highestScoredProcessor)
    
    const bankTransferResult = processBankTransfer(highestScoredProcessor, amount)

    if (!bankTransferResult.success) {
        // reduce the processor's score
        await zincrby(BANK_TRANSFER_PROCESSORS_SET_NAME, -10, highestScoredProcessor)
    } else {
        // increase the processor's score
        await zincrby(BANK_TRANSFER_PROCESSORS_SET_NAME, 10, highestScoredProcessor)
    }
    const finalProcessorList = await zrevrange(BANK_TRANSFER_PROCESSORS_SET_NAME, 0, -1, 'WITHSCORES')
    console.log(finalProcessorList)
    return bankTransferResult
}

// transferToBank(10).then(console.log).catch(console.log)