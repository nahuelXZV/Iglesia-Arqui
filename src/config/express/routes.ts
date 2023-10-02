import { Router } from 'express';
import { MinisterioController } from '../../controllers/ministerio.controller';

export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        
        // Ministerio
        const ministerioController = new MinisterioController();
        router.get('/ministerio', ministerioController.index);
        router.post('/ministerio', ministerioController.store);
        router.put('/ministerio/:id', ministerioController.update);
        router.delete('/ministerio/:id', ministerioController.delete);





        return router;
    }
}