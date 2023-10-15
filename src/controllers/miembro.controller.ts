import { Request, Response } from 'express';
import { MiembroModel, Miembro } from '../models';
import { MiembroOptions, MiembroView } from '../views/miembro.view';

export class MiembroController {

    private miembroModel?: MiembroModel;
    private miembroView?: MiembroView;

    public index = async (req: Request, res: Response) => {
        this.miembroModel = new MiembroModel(undefined);
        this.miembroView = new MiembroView(req, res);
        const miembroOption: MiembroOptions = {
            miembros: await this.miembroModel.getAll()
        }
        this.miembroView.render(miembroOption);
    };

    public store = async (req: Request, res: Response) => {
        const { nombre, telefono, correo, fecha_nacimiento, direccion, invitado_por } = req.body;
        const miembro: Miembro = { nombre, telefono, correo, fecha_nacimiento, direccion, invitado_por };
        const relaciones = JSON.parse(req.body.relaciones);
        this.miembroModel = new MiembroModel({ ...miembro, relaciones });
        this.miembroView = new MiembroView(req, res);
        await this.miembroModel.store();
        this.miembroView.redirect();
    };

    public update = async (req: Request, res: Response) => {
        const { id, nombre, telefono, correo, fecha_nacimiento, direccion, invitado_por } = req.body;
        const relaciones = JSON.parse(req.body.relaciones);
        this.miembroView = new MiembroView(req, res);
        this.miembroModel = new MiembroModel({
            id: +id,
            nombre,
            telefono,
            correo,
            fecha_nacimiento,
            direccion,
            invitado_por,
            relaciones
        });
        await this.miembroModel.update();
        this.miembroView.redirect();
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.body;
        this.miembroModel = new MiembroModel(undefined);
        this.miembroView = new MiembroView(req, res);
        await this.miembroModel.delete(+id);
        this.miembroView.redirect();
    };

}