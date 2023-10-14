import { Request, Response } from 'express';
import { Miembro } from "../models";

export interface MiembroOptions {
    miembros: Miembro[] | undefined;
}

export class MiembroView {

    private view = 'miembroView';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(miembroOptions: MiembroOptions) {
        const { miembros } = miembroOptions;
        return this.res.render(this.view, { miembros });
    }

    redirect() {
        return this.res.redirect('/miembros');
    }

}
