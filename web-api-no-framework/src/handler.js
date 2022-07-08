import { parse }  from 'node:url';
import { routes } from './routes/heroRoute.js';
import { DEFAULT_HEADER } from './util/util.js';
import { join, dirname} from 'node:path';
import { fileURLToPath} from 'node:url';

import { generateInstance } from './factories/heroFactory.js';

// Estudar essas libs
const currentDir = dirname(
    fileURLToPath(
        import.meta.url
    )
)

console.log("Diretorio" + currentDir);

const filePath = join(currentDir, './../database', 'data.json');

const heroService = generateInstance({
    filePath
})

const heroRoutes = routes({
    heroService
});

const allRoutes = {
     ...heroRoutes,
    //404 Pagina nao encontrada
    default: (request,response)=> {
        response.writeHead(404, DEFAULT_HEADER);
        response.write("Requisição não encontrada");
        response.end();
    }
}

function handler(request, response) {
    const {
        url,
        method
    } = request

    const {
       pathname
    } = parse(url, true);


    const key = `${pathname}:${method.toLowerCase()}`;
    console.log({key});
    const chosen = allRoutes[key] || allRoutes.default;
    
    return Promise.resolve(chosen(request,response))
    .catch(handlerError(response));
}


// Printar o erro caso de qualquer problema no sistema

function handlerError(response){
    return error => {
        console.log("Aconteceu algo no servidor!", error.stack);
        response.writeHead(500, DEFAULT_HEADER);
        response.write(JSON.stringify({
            error: "Erro no servidor"
        }));
        response.end();
    }
}

export default handler