import { Router } from 'express';
import { MinisterioController, CargoController, MiembroController, EventoController, HistorialCargoController } from '../../controllers/';

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

        // Eventos
        const eventoController = new EventoController();
        router.get('/eventos', eventoController.index);
        router.post('/eventos/create', eventoController.store);
        router.post('/eventos/update', eventoController.update);
        router.post('/eventos/delete', eventoController.delete);

        // Historial Cargo
        const historialCargoController = new HistorialCargoController();
        router.get('/historial', historialCargoController.index);
        router.post('/historial/create', historialCargoController.store);
        router.post('/historial/update', historialCargoController.update);
        router.post('/historial/delete', historialCargoController.delete);

        return router;
    }
}