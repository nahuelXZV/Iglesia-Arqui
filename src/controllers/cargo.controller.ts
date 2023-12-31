import { Request, Response } from 'express';
import { CargoModel, Cargo, MinisterioModel, Ministerio } from '../models';
import { CargoView } from '../views';

export class CargoController {

    private cargoModel?: CargoModel;
    private ministerioModel?: MinisterioModel;
    private cargoView?: CargoView;

    public index = async (req: Request, res: Response) => {
        this.cargoModel = new CargoModel(undefined);
        this.ministerioModel = new MinisterioModel(undefined);
        this.cargoView = new CargoView(req, res);
        const cargoOptions = {
            cargos: await this.cargoModel.getAll(),
            ministerios: await this.ministerioModel.getAll()
        };
        this.cargoView.render(cargoOptions);
    };

    public store = async (req: Request, res: Response) => {
        const { nombre, descripcion, ministerio_id } = req.body;
        const cargo: Cargo = { nombre, descripcion, ministerio_id };
        this.cargoView = new CargoView(req, res);
        this.cargoModel = new CargoModel(cargo);
        this.ministerioModel = new MinisterioModel(undefined);
        await this.cargoModel.store();
        const cargoOptions = {
            cargos: await this.cargoModel.getAll(),
            ministerios: await this.ministerioModel.getAll()
        };
        this.cargoView.render(cargoOptions);
    };

    public update = async (req: Request, res: Response) => {
        const { id, nombre, descripcion, ministerio_id } = req.body;
        this.cargoView = new CargoView(req, res);
        this.ministerioModel = new MinisterioModel(undefined);
        this.cargoModel = new CargoModel({
            id: +id,
            nombre,
            descripcion,
            ministerio_id
        });
        await this.cargoModel.update();
        const cargoOptions = {
            cargos: await this.cargoModel.getAll(),
            ministerios: await this.ministerioModel.getAll()
        };
        this.cargoView.render(cargoOptions);
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.body;
        this.cargoView = new CargoView(req, res);
        this.ministerioModel = new MinisterioModel(undefined);
        this.cargoModel = new CargoModel(undefined);
        await this.cargoModel.delete(+id);
        const cargoOptions = {
            cargos: await this.cargoModel.getAll(),
            ministerios: await this.ministerioModel.getAll()
        };
        this.cargoView.render(cargoOptions);
    };

}