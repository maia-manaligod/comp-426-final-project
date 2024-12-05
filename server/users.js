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
                        else { return  {
                            "userID": exists.id,
                            "username" : exists.username
                        }}
                        
                    }
                        
                } catch (e) {
                    console.error('Error finding user:', e);
                    return null
                }
    
        }
        return null

    }

    static async getUserStats(data){
        let {userID} = data;
        try{
            let category_results = await db.all(`
                select category, 
                count(case when correct_answer = user_answer then 1 end) as correct_answers, 
                count(*) as total_answered,
                count(case when correct_answer = user_answer then 1 end) * 1.0 /
                count(*) as category_accuracy
                from questions
                where user_id = ?
                group by category
                order by category_accuracy desc
            `, userID)

            let overall_results = await db.get(
                `
                select 'Overall' as category,
                count(case when correct_answer = user_answer then 1 end) as correct_answers,
                count(*) as total_answered,
                count(case when correct_answer = user_answer then 1 end) * 1.0 / count(*)  as accuracy
                from questions
                where user_id = ?
                `
            , userID)
    
            let results = await db.get(`
                select username
                from users 
                where id = ? 
            `, userID)

            console.log(category_results)

            results["categoryStats"] = category_results
            results["overallStats"] = overall_results

            return results
        } catch (e) {
            console.log('error', e)
            return null
        }
    }

    static async update(data){
        let {user_id, username, password} = data

        console.log(data)

        let old_data = await db.get(
            `select password
            from users
            where id = ?`, 
            user_id
        )

        console.log(old_data)

        if (old_data.password != password) return 'incorrect password'

        try {
            let result = await db.run(
                'update users set username = ? where id = ?', username, user_id
            )
    
            return result
        }
        catch (e) {
            return null
        }
        
    }

    static async delete(data){
        let {user_id} = data

        try {
            await db.run(
                `DELETE FROM users
                WHERE id = ?`,
                user_id
            );
        
            await db.run(
                `DELETE FROM questions
                WHERE user_id = ?`,
                user_id
            );
            
            console.log("ran")
        
            return true
        } catch (e) {
            console.log("error", e)
            return null
        }


    }


}