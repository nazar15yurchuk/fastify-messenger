import Fastify from 'fastify'
import {basicAuth} from "./plugins/basic.auth";
import {authController} from "./controllers/auth.controller";
import {chatController} from "./controllers/chat.controller";
import fastifyMultipart from '@fastify/multipart';

const app = Fastify({
    logger: true
})

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.register(fastifyMultipart);

app.post('/account/register', authController.register);
app.post('/message/text', chatController.createTextMessage);
app.post('/message/file', chatController.createFileMessage);
app.get('/message/list', chatController.getMessages);
app.get('/message/content', chatController.getMessageContent);

basicAuth.registerBasicAuth(app);

app.after(() => {
    app.addHook('onRequest', app.basicAuth);

    app.get('/protected', async (request, reply) => {
        reply.send({ message: 'You have access to this protected route!' });
    });
});

const start = async () => {
    try {
        await app.listen({ port: 3000 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
