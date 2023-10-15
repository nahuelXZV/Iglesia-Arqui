import { Request, Response } from 'express';
import { Evento, EventoModel, MiembroModel } from '../models';
import { EventoOptions, EventoView } from '../views/';

export class EventoController {

    private eventoModel?: EventoModel;
    private miembroModel?: MiembroModel;
    private eventoView?: EventoView;

    public index = async (req: Request, res: Response) => {
        this.eventoModel = new EventoModel(undefined);
        this.miembroModel = new MiembroModel(undefined);
        this.eventoView = new EventoView(req, res);
        const eventoOptions: EventoOptions = {
            eventos: await this.eventoModel.getAll(),
            miembros: await this.miembroModel.getAll()
        }
        this.eventoView.render(eventoOptions);
    };

    public store = async (req: Request, res: Response) => {
        const { nombre, descripcion, fecha, hora } = req.body;
        const evento: Evento = { nombre, descripcion, fecha, hora };
        const participantes = JSON.parse(req.body.participantes);
        const arrayParticipantes: number[] = [];
        participantes.forEach((item: any) => {
            arrayParticipantes.push(item.participante);
        });
        this.eventoView = new EventoView(req, res);
        this.eventoModel = new EventoModel({ ...evento, arrayParticipantes });
        await this.eventoModel.store();
        this.eventoView.redirect();
    };

    public update = async (req: Request, res: Response) => {
        const { id, nombre, descripcion, fecha, hora } = req.body;
        const participantes = JSON.parse(req.body.participantes);
        const arrayParticipantes: number[] = [];
        participantes.forEach((item: any) => {
            arrayParticipantes.push(item.participante);
        });
        this.eventoView = new EventoView(req, res);
        this.eventoModel = new EventoModel({
            id: +id,
            nombre,
            descripcion,
            fecha,
            hora,
            arrayParticipantes
        });
        await this.eventoModel.update();
        this.eventoView.redirect();
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.body;
        this.eventoModel = new EventoModel(undefined);
        this.eventoView = new EventoView(req, res);
        await this.eventoModel.delete(+id);
        this.eventoView.redirect();
    };

}