import {post,instance} from '@/api/index'


export function loginUser(data) {
    return post('/app/user/login', data)
}

// export function getImageVerifica(data) {
//     return get('/app/user/image', data)
// }

export function getImageVerifica(params) {
  return instance.get('/app/user/image', {
    params,
    responseType: 'arraybuffer' // ⭐ 强烈推荐
  })
}
