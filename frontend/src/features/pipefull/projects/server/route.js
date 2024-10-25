const app = new Hono().basePath('/api');

const routes = app
.route('/members', members)
.route('/', members)

export default app;