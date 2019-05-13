import * as yargs from 'yargs';
import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import worker from "./worker";

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1397/11/9 (2019/1/29).
 */

const argv = yargs.strict(true)
		.usage(`Usage: $0 [options]`)
		.example(`$0 --port=3000`, 'Will listen on port 3000.')
		.option('p', {
			alias: ['port'],
			describe: 'Listen-on Port-Number',
			type: 'number',
			default: 3000,
			demand: true,
		})
		.help()
		.alias('h', 'help')
		.argv;
//*****************************************************************/

const app = express();

app.options('/', cors());

app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.post('/', cors(), (req, res) => {
	//console.debug(req.body);
	worker(req.body, res);
});

app.use((req, res, next) => res.status(404).send(`Sorry can't find that!`));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send(`Something broke!`)
});

const port = argv.port;
app.listen(port, () => console.log(`App listening on http://127.0.0.1:${port} ...`));
