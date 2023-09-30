import { Response } from './test.json' assert {type: 'json'};
import { DestinyActivityModifierDefinition } from '../db/content.json' assert {type: 'json'};
import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    console.log(Response);
    res.send(DestinyActivityModifierDefinition);
});

app.listen(port, () => {
    console.log('app listening via port', port);
})
