import { Router } from 'express';
import { MinisterioController, CargoController, MiembroController } from '../../controllers/';

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

        // Miembro
        const miembroController = new MiembroController();
        router.get('/miembros', miembroController.index);
        router.post('/miembros', miembroController.store);
        router.put('/miembros/:id', miembroController.update);
        router.delete('/miembros/:id', miembroController.delete);

        return router;
    }
}