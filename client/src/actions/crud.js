let port = 8080;
let host = 'localhost';

export const execute_post = async function (path, data) {
    let fetch_result = await fetch('http://' + host + ":" + port + path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!fetch_result.ok) {
        let error_message = await fetch_result.json()
        return {
            error: fetch_result.status,
            error_message: error_message
        };
    }
    let result_json = await fetch_result.json();
    return result_json;
}

export const execute_get = async function (path) {
    try {
        let fetch_result = await fetch("http://" + host + ":" + port + path, {
            method: 'GET',
            credentials: 'include'
        });
        if (!fetch_result.ok) {
            return {
                error: fetch_result.status,
                error_message: fetch_result.statusText
            };
        }
        let result_json = await fetch_result.json();
        return result_json;
    } catch (e) {
        console.log('error', e)
        return {
            error: e
        };
    }
   
}

export const execute_put = async function (path, data) {
    let fetch_result = await fetch('http://' + host + ":" + port + path, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!fetch_result.ok) {
        let error_message = await fetch_result.json()
        return {
            error: fetch_result.status,
            error_message: error_message
        };
    }
    let result_json = await fetch_result.json();
    return result_json;
}

export const execute_delete = async function (path, data) {
    let fetch_result = await fetch('http://' + host + ":" + port + path, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    console.log(fetch_result);
    if (!fetch_result.ok) {
        let error_message = await fetch_result.json();
        return {
            error: fetch_result.status,
            error_message: error_message
        };
    }
    let result_json = await fetch_result.json();
    return result_json;
};
