import { envs } from './config/envs';
import { AppRoutes } from './config/express/routes';
import { Server } from './config/express/server';

(async () => {
    main();
})();

function main() {
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    });
    server.start();
}