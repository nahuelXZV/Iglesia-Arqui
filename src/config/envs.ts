import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
  POSTGRES_URL: get('POSTGRES_URL').default('public').asString(),
  POSTGRES_USER: get('POSTGRES_USER').default('public').asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').default('public').asString(),
  POSTGRES_DB: get('POSTGRES_DB').default('public').asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').default('public').asPortNumber(),
  POSTGRES_HOST: get('POSTGRES_HOST').default('public').asString(),
  NODE_ENV: get('NODE_ENV').default('public').asString(),
}