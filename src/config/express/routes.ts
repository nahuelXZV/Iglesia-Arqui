import { Router } from 'express';
import { MinisterioController, CargoController, MiembroController } from '../../controllers/';

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        // Index
        router.get('/', (req, res) => {
            res.render('index');
        });

        // Ministerio
        const ministerioController = new MinisterioController();
        router.get('/ministerio', ministerioController.index);
        router.post('/ministerio/create', ministerioController.store);
        router.post('/ministerio/update', ministerioController.update);
        router.post('/ministerio/delete', ministerioController.delete);

        // Cargo
        const cargoController = new CargoController();
        router.get('/cargo', cargoController.index);
        router.post('/cargo/create', cargoController.store);
        router.post('/cargo/update', cargoController.update);
        router.post('/cargo/delete', cargoController.delete);

        // Miembro
        const miembroController = new MiembroController();
        router.get('/miembros', miembroController.index);
        router.post('/miembros/create', miembroController.store);
        router.post('/miembros/update', miembroController.update);
        router.post('/miembros/delete', miembroController.delete);

        return router;
    }
}