import { Client } from 'pg';
import { envs } from '../envs';

export interface dbConfig {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
}

export interface DBConection {
    connect: () => Promise<Client>;
    disconnect: () => Promise<void>;
}

const dbConfig: dbConfig = {
    user: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    host: envs.POSTGRES_HOST, // Cambia esto según la ubicación de tu base de datos
    database: envs.POSTGRES_DB,
    port: envs.POSTGRES_PORT, // Puerto por defecto de PostgreSQL
};

export class db implements DBConection {

    public client: Client;

    constructor() {
        this.client = new Client(dbConfig);
    }

    public async connect(): Promise<Client> {
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
        return this.client;
    }

    public async disconnect(): Promise<void> {
        await this.client.end();
    }
}