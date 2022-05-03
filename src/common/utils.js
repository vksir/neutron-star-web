export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    console.log('setToken: ' + token);
    localStorage.setItem('token', token)
}

export function removeToken() {
    console.log('removeToken');
    localStorage.removeItem('token')
}

export function getHostUUID() {
    return localStorage.getItem('host_uuid');
}

export function setHostUUID(uuid) {
    localStorage.setItem('host_uuid', uuid);
}

export function getHostNickname() {
    return localStorage.getItem('host_nickname');
}

export function setHostNickname(nickname) {
    localStorage.setItem('host_nickname', nickname);
}