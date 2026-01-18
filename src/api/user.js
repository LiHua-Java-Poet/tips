import {post,instance,get} from '@/api/index'


export function loginUser(data) {
    return post('/app/user/login', data)
}

export function addUser(data) {
    return post('/app/user/save', data)
}

export function updateUser(data) {
    return post('/app/user/update', data)
}

export function deleteUser(data) {
    return post('/app/user/delete', data)
}

export function userList(data) {
    return get('/app/user/list', data)
}

export function getUserMenu(data) {
    return get('/app/user/getUserMenu', data)
}

export function getImageVerifica(params) {
  return instance.get('/app/user/image', {
    params,
    responseType: 'arraybuffer' // ⭐ 强烈推荐
  })
}
