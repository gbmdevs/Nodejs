import { parse }  from 'node:url';
import { DEFAULT_HEADER } from './util/util.js';


const allRoutes = {
    
    '/heroes:get': async (request,response) =>{
        throw new Error("Deu erro aqui!");
        response.write('GET');
        response.end();
    },

    //404 Pagina nao encontrada
    default: (request,response)=> {
        response.writeHead(404, DEFAULT_HEADER);
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