import {get,post} from '@/api/index'

export function getRoleList(params) {
    return get('/app/sysRole/list',params)
}

export function getRoleInfo(params) {
    return get('/app/sysRole/info',params)
}

export function addRole(params) {
    return post('/app/sysRole/save',params)
}

export function deleteRole(params) {
    return post('/app/sysRole/delete',params)
}

export function deleteRoleMenu(params) {
    return post('/app/sysRoleMenu/deletePermission',params)
}
