import { DEFAULT_HEADER } from '../util/util.js';
import { once} from 'node:events';

import Hero  from '../entities/hero.js'; 

const routes = ({
    heroService
}) => ({
    '/heroes:get': async(request,response) => {
        response.write('GET');
        response.end();
    },
    '/heroes:post': async(request,response) => {
        const data = await once(request, 'data');
        const item = JSON.parse(data);
        const hero = new Hero(item);
        
        const id = await heroService.create(hero);
         
        response.writeHead(201, DEFAULT_HEADER);
        response.write(JSON.stringify({
            id,
            success: "User created with success!!",
        }));
        return response.end();
    }
})

export {
    routes
}