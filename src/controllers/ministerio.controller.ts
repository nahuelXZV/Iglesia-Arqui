import { Request, Response } from 'express';
import { Ministerio, MinisterioModel } from '../models/';

export class MinisterioController {

    private ministerioModel: MinisterioModel;

    constructor() {
        this.ministerioModel = new MinisterioModel(undefined);
    }

    public index = async (req: Request, res: Response) => {
        this.ministerioModel = new MinisterioModel(undefined);
        const data: Ministerio[] | undefined = await this.ministerioModel.getAll();
        res.render('ministerio', { datos: data });
    };

    public store = (req: Request, res: Response) => {
        const { nombre } = req.body;
        const ministerio: Ministerio = { nombre };
        this.ministerioModel = new MinisterioModel(ministerio);
        this.ministerioModel.store();
        res.json({ status: 'Ministerio creado' });
    };

    public update = (req: Request, res: Response) => {
        const { nombre } = req.body;
        const { id } = req.params;
        this.ministerioModel = new MinisterioModel({
            id: +id,
            nombre
        });
        this.ministerioModel.update();
        res.json({ status: 'Ministerio actualizado' });
    };

    public delete = async (req: Request, res: Response) => {
        this.ministerioModel = new MinisterioModel(undefined);
        const { id } = req.params;
        await this.ministerioModel.delete(+id);
        res.json({ status: 'Ministerio eliminado' });
    };

}