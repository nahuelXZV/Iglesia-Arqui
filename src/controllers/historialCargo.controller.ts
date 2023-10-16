import { Request, Response } from 'express';
import { CargoModel, MiembroModel, HistorialCargoModel, HistorialCargo } from '../models';
import { HistorialCargoOptions, HistorialCargoView } from '../views/historialCargo.view';

export class HistorialCargoController {

    private cargoModel?: CargoModel;
    private miembroModel?: MiembroModel;
    private historialCargoModel?: HistorialCargoModel;
    private historialCargoView?: HistorialCargoView;

    public index = async (req: Request, res: Response) => {
        this.cargoModel = new CargoModel(undefined);
        this.miembroModel = new MiembroModel(undefined);
        this.historialCargoModel = new HistorialCargoModel(undefined);
        this.historialCargoView = new HistorialCargoView(req, res);
        const historialCargoOptions: HistorialCargoOptions = {
            cargos: await this.cargoModel.getAll(),
            miembros: await this.miembroModel.getAll(),
            historial: await this.historialCargoModel.getAll()
        };
        this.historialCargoView.render(historialCargoOptions);
    };

    public store = async (req: Request, res: Response) => {
        const { fecha_inicio, fecha_final, estado, miembro_id, cargo_id } = req.body;
        const historial: HistorialCargo = { fecha_inicio, fecha_final, estado, miembro_id, cargo_id };
        this.historialCargoView = new HistorialCargoView(req, res);
        this.historialCargoModel = new HistorialCargoModel(historial);
        this.cargoModel = new CargoModel(undefined);
        this.miembroModel = new MiembroModel(undefined);
        await this.historialCargoModel.store();
        const historialCargoOptions: HistorialCargoOptions = {
            cargos: await this.cargoModel.getAll(),
            miembros: await this.miembroModel.getAll(),
            historial: await this.historialCargoModel.getAll()
        };
        this.historialCargoView.render(historialCargoOptions);
    };

    public update = async (req: Request, res: Response) => {
        const { id, fecha_inicio, fecha_final, estado, miembro_id, cargo_id } = req.body;
        const historial: HistorialCargo = { id, fecha_inicio, fecha_final, estado, miembro_id, cargo_id };
        this.historialCargoView = new HistorialCargoView(req, res);
        this.historialCargoModel = new HistorialCargoModel(historial);
        this.cargoModel = new CargoModel(undefined);
        this.miembroModel = new MiembroModel(undefined);
        await this.historialCargoModel.update();
        const historialCargoOptions: HistorialCargoOptions = {
            cargos: await this.cargoModel.getAll(),
            miembros: await this.miembroModel.getAll(),
            historial: await this.historialCargoModel.getAll()
        };
        this.historialCargoView.render(historialCargoOptions);
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.body;
        this.historialCargoView = new HistorialCargoView(req, res);
        this.cargoModel = new CargoModel(undefined);
        this.miembroModel = new MiembroModel(undefined);
        this.historialCargoModel = new HistorialCargoModel(undefined);
        await this.historialCargoModel.delete(+id);
        const historialCargoOptions: HistorialCargoOptions = {
            cargos: await this.cargoModel.getAll(),
            miembros: await this.miembroModel.getAll(),
            historial: await this.historialCargoModel.getAll()
        };
        this.historialCargoView.render(historialCargoOptions);
    };

}