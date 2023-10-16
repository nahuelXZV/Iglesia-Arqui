import { Request, Response } from 'express';
import { Ministerio } from "../models";

export interface MinisterioOptions {
    ministerios: Ministerio[] | undefined;
}

export class MinisterioView {

    private view = 'ministerioView';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(ministerioView: MinisterioOptions) {
        const { ministerios } = ministerioView;
        return this.res.render(this.view, { ministerios });
    }

    redirect() {
        return this.res.redirect('/ministerio');
    }

}
