import { Request, Response } from 'express';
import { Ministerio, MinisterioModel } from '../models/ministerio.model';

export class MinisterioController {

    private ministerioModel: MinisterioModel;

    constructor() {
        this.ministerioModel = new MinisterioModel(undefined);
    }

    public index = async (req: Request, res: Response) => {
        const data: Ministerio[] | undefined = await new MinisterioModel(undefined).getAll();
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
        console.log(id, nombre);
        this.ministerioModel = new MinisterioModel({
            id: +id,
            nombre
        });
        this.ministerioModel.update();
        res.json({ status: 'Ministerio actualizado' });
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        await new MinisterioModel(undefined).delete(+id);
        res.json({ status: 'Ministerio eliminado' });
    };

}