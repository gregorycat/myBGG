import express from 'express';
import pathUtils from 'path';

const app = express();

const appDir = pathUtils.resolve(__dirname, '../../dist');
app.use(express.static(appDir));
app.use(express.urlencoded());
app.use(express.json());

export default app;
