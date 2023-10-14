import { Request, Response } from 'express';
import { Cargo, Ministerio } from "../models";

export interface CargoOptions {
    cargos: Cargo[] | undefined;
    ministerios?: Ministerio[] | undefined;
}

export class CargoView {

    private view = 'cargoView';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(cargoOptions: CargoOptions) {
        const { cargos, ministerios } = cargoOptions;
        return this.res.render(this.view, { cargos, ministerios });
    }

    redirect() {
        return this.res.redirect('/cargo');
    }

}
