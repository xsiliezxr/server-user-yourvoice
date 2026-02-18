'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';

const BASE_PATH = 'yourVoiceUser/v1';

const middlewares = (app) => {
    app.use(morgan('dev'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
}

const routes = (app) => {

    app.get(`/${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'yourVoiceUser',
            version: '1.0.0'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Endpoint not found',
            service: 'yourVoiceUser',
            version: '1.0.0'
        });
    });
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set('trust proxy', true);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        
    } catch (error) {
        console.error('Error starting user server: ', error);
    }
}