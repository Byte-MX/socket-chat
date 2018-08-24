class Usuario {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {

        // Como el ID es único, solo habrá una persona en el arreglo
        // (o ninguna).
        let persona = this.personas.filter(alguien => {
            return alguien.id === id
        })[0];
        // También se puede escribir así:
        //let persona = this.personas.filter(alguien => alguien.id === id)[0];

        // Si encuentra una persona la regresa. Si no, regresa undefined o null
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        /* // Equivalente
        let personasEnSala = this.personas.filter(alguien => {
            return alguien.sala === sala
        });*/
        let personasEnSala = this.personas.filter(alguien => alguien.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        // Obtiene la persona borrada antes de sacarla del arreglo
        // (Luego de sacarla, ya no tengo forma de recuperar
        // su información).
        let personaBorrada = this.getPersona(id);

        // Reasigna el arreglo a él mismo, sin la persona indicada.
        /* this.personas = this.personas.filter(alguien =>{
             return alguien.id !== id
         }); */
        this.personas = this.personas.filter(alguien => alguien.id !== id);

        return personaBorrada;
    }
}

module.exports = {
    Usuario
};