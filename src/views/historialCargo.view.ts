import { Request, Response } from 'express';
import { Cargo, HistorialCargo, Miembro } from "../models";

export interface HistorialCargoOptions {
    historial: HistorialCargo[] | undefined;
    miembros: Miembro[] | undefined;
    cargos: Cargo[] | undefined;
}

export class HistorialCargoView {

    private view = 'historialCargoView';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(historialCargoOptions: HistorialCargoOptions) {
        const { historial, miembros, cargos } = historialCargoOptions;
        return this.res.render(this.view, { historial, miembros, cargos });
    }

    redirect() {
        return this.res.redirect('/historial');
    }

}
