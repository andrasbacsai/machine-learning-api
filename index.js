const imageClassifier = require('./imageClassifier')
const PORT = process.env.PORT || 3000
const fastify = require('fastify')({
    logger: {
        serializers: {
          req (request) {
            return {
              reqId: request.reqId
            }
          }
        }
    }
})

const schema = {
    body: {
        type: 'object',
        properties: {
            modelUrl: { type: 'string' },
            imageUrl: { type: 'string' }
        },
        required: ['modelUrl', 'imageUrl']
    }
}
fastify.get('/', (request, reply) =>{
    return {
        'Hey': 'Serious Machine Learning things going on here!',
        'README':'https://github.com/andrasbacsai/machine-learning-api'
    }
})

fastify.post('/api/tensorflowjs/imageClassifier', { schema }, async (request, reply) => {
    const { modelUrl, imageUrl } = request.body
    try {
        const predictions = await imageClassifier({ modelUrl, imageUrl })
        reply.code(200).send({ predictions })
    } catch (error) {
        throw { statusCode: 500, error: error.message }
    }

})

const start = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
