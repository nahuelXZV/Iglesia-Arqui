import { Request, Response } from 'express';
import { MiembroModel, Miembro } from '../models';

export class MiembroController {

    private miembroModel?: MiembroModel;

    public index = async (req: Request, res: Response) => {
        this.miembroModel = new MiembroModel(undefined);
        const data: Miembro[] | undefined = await this.miembroModel.getAll();
        console.table(data);
        res.render('miembroView', { miembros: data });
    };

    public store = (req: Request, res: Response) => {
        const { nombre, telefono, correo, fecha_nacimiento, direccion } = req.body;
        const miembro: Miembro = { nombre, telefono, correo, fecha_nacimiento, direccion };
        this.miembroModel = new MiembroModel(miembro);
        this.miembroModel.store();
        res.json({ status: 'Miembro creado' });
    };

    public update = (req: Request, res: Response) => {
        const { nombre, telefono, correo, fecha_nacimiento, direccion } = req.body;
        const { id } = req.params;
        this.miembroModel = new MiembroModel({
            id: +id,
            nombre,
            telefono,
            correo,
            fecha_nacimiento,
            direccion
        });
        this.miembroModel.update();
        res.json({ status: 'Miembro actualizado' });
    };

    public delete = async (req: Request, res: Response) => {
        this.miembroModel = new MiembroModel(undefined);
        const { id } = req.params;
        await this.miembroModel.delete(+id);
        res.json({ status: 'Miembro eliminado' });
    };

}