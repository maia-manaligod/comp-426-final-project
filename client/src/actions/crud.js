let port = 8080;
let host = 'localhost';

export const execute_put = async function (path, data) {
    console.log("data, ", data)
    let fetch_result = await fetch('http://' + host + ":" + port + path, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    console.log(fetch_result)
    if (!fetch_result.ok) {
        console.log("put failed")
        return null;
    }
    let result_json = await fetch_result.json();
    return result_json;
}

export const execute_get = async function (path) {
    console.log("http://" + host + ":" + port + path)
    let fetch_result = await fetch("http://" + host + ":" + port + path, {
        method: 'GET',
        credentials: 'include'
    });
    if (!fetch_result.ok) {
        console.log('GET failed.');
        return null;
    }
    let result_json = await fetch_result.json();
    return result_json;
}
