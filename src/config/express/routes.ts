import { Router } from 'express';
import { MinisterioController, CargoController } from '../../controllers/';

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        // Ministerio
        const ministerioController = new MinisterioController();
        router.get('/ministerio', ministerioController.index);
        router.post('/ministerio', ministerioController.store);
        router.put('/ministerio/:id', ministerioController.update);
        router.delete('/ministerio/:id', ministerioController.delete);

        // Cargo
        const cargoController = new CargoController();
        router.get('/cargo', cargoController.index);
        router.post('/cargo', cargoController.store);
        router.put('/cargo/:id', cargoController.update);
        router.delete('/cargo/:id', cargoController.delete);

        return router;
    }
}