import {readFile, writeFile} from 'node:fs/promises';

export default class HeroRepository{
   
    constructor({
        file
    }){
        this.file = file;
    }

    async #currentFileContent(){
        return JSON.parse(await readFile(this.file));
    }

    // Criando
    async create(date){

    }
}