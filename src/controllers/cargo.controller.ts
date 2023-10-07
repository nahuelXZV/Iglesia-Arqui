import { Request, Response } from 'express';
import { CargoModel, Cargo, MinisterioModel, Ministerio } from '../models';

export class CargoController {

    private cargoModel: CargoModel;
    private ministerioModel: MinisterioModel;

    constructor() {
        this.cargoModel = new CargoModel(undefined);
        this.ministerioModel = new MinisterioModel(undefined);
    }

    public index = async (req: Request, res: Response) => {
        this.cargoModel = new CargoModel(undefined);
        this.ministerioModel = new MinisterioModel(undefined);
        const data: Cargo[] | undefined = await this.cargoModel.getAll();
        const ministerios: Ministerio[] | undefined = await this.ministerioModel.getAll();
        res.render('cargoView', { datos: data, ministerios });
    };

    public store = (req: Request, res: Response) => {
        const { nombre, descripcion, ministerio_id } = req.body;
        const cargo: Cargo = { nombre, descripcion, ministerio_id };
        this.cargoModel = new CargoModel(cargo);
        this.cargoModel.store();
        res.json({ status: 'Cargo creado' });
    };

    public update = (req: Request, res: Response) => {
        const { nombre, descripcion, ministerio_id } = req.body;
        const { id } = req.params;
        this.cargoModel = new CargoModel({
            id: +id,
            nombre,
            descripcion,
            ministerio_id
        });
        this.cargoModel.update();
        res.json({ status: 'Cargo actualizado' });
    };

    public delete = async (req: Request, res: Response) => {
        this.cargoModel = new CargoModel(undefined);
        const { id } = req.params;
        await this.cargoModel.delete(+id);
        res.json({ status: 'Cargo eliminado' });
    };

}