import { Request, Response } from 'express';
import { Evento, Miembro } from "../models";

export interface EventoOptions {
    eventos: Evento[] | undefined;
    miembros: Miembro[] | undefined;
}

export class EventoView {

    private view = 'eventoView';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(eventoOptions: EventoOptions) {
        const { eventos, miembros } = eventoOptions;
        return this.res.render(this.view, { eventos, miembros });
    }

    redirect() {
        return this.res.redirect('/eventos');
    }

}
