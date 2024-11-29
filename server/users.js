import {db} from './db.js';


export class User{

    #id
    #username
    #password
    #correct
    #answered

    constructor(id, username, password){
        this.#id = id
        this.#username = username
        this.#password = password
        this.#correct = 0;
        this.#answered = 0;

    }


    static async createUser(data){
        if (data &&
            typeof data === 'object' &&
            typeof data.username === 'string' &&
            typeof data.password === 'string'){

            try {
                let exists = await db.get('select * from users where username = ?', [data.username])
                console.log("exists?", exists)
                if (exists){
                    return 'exists'
                } else {
                    const result = await db.run(
                    'insert into users (username, password, correct, answered) values (?, ?, ?, ?)',
                    data.username,
                    data.password,
                    0,
                    0
                    );

                    console.log("results", result)

                    return new User(result.lastID, data.username, data.password, 0, 0);
                }
            } catch (e) {
                console.error('Error creating user:', e);
                return null
            }
        } 
        else {
            return null
        }
    }


    static async login(data){
        if (data &&
            typeof data === 'object' &&
            typeof data.username === 'string' &&
            typeof data.password === 'string'){
                try {
                    let exists = await db.get('select * from users where username =  ?', [data.username])
                    console.log("exists?", exists)
                    if (!exists){
                        return 'does_not_exist'
                    } else {
                        if (exists.password != data.password){ return 'incorrect_password'}
                        else { return exists.id}
                        
                    }
                        
                } catch (e) {
                    console.error('Error finding user:', e);
                    return null
                }
    
        }
        return null

    }

}