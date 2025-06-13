import {post} from '@/api/index'


export function loginUser(data) {
    return post('/app/user/login', data)
}