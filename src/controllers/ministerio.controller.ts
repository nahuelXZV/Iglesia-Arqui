import { Request, Response } from 'express';
import { Ministerio, MinisterioModel } from '../models/';
import { MinisterioView, MinisterioOptions } from '../views/';

export class MinisterioController {

    private ministerioModel?: MinisterioModel;
    private ministerioView?: MinisterioView;

    public index = async (req: Request, res: Response) => {
        this.ministerioModel = new MinisterioModel(undefined);
        this.ministerioView = new MinisterioView(req, res);
        const ministerioOptions: MinisterioOptions = { ministerios: await this.ministerioModel.getAll() };
        this.ministerioView.render(ministerioOptions);
    };

    public store = async (req: Request, res: Response) => {
        const { nombre } = req.body;
        const ministerio: Ministerio = { nombre };
        this.ministerioModel = new MinisterioModel(ministerio);
        this.ministerioView = new MinisterioView(req, res);
        await this.ministerioModel.store();
        const ministerioOptions: MinisterioOptions = { ministerios: await this.ministerioModel.getAll() };
        this.ministerioView.render(ministerioOptions);
    };

    public update = async (req: Request, res: Response) => {
        const { id, nombre } = req.body;
        this.ministerioView = new MinisterioView(req, res);
        this.ministerioModel = new MinisterioModel({
            id: +id,
            nombre
        });
        await this.ministerioModel.update();
        const ministerioOptions: MinisterioOptions = { ministerios: await this.ministerioModel.getAll() };
        this.ministerioView.render(ministerioOptions);
    };

    public delete = async (req: Request, res: Response) => {
        this.ministerioModel = new MinisterioModel(undefined);
        this.ministerioView = new MinisterioView(req, res);
        const { id } = req.body;
        await this.ministerioModel.delete(+id);
        const ministerioOptions: MinisterioOptions = { ministerios: await this.ministerioModel.getAll() };
        this.ministerioView.render(ministerioOptions);
    };

}