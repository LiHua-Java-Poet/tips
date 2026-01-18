import {get,post} from '@/api/index'

export function getMenuList(params) {
    return get('/app/sysMenu/list',params)
}

export function deleteMenu(params){
    return post('/app/sysMenu/delete',params)
}

export function updateMenu(params){
    return post('/app/sysMenu/update',params)
}

export function saveMenu(params){
    return post('/app/sysMenu/save',params)
}

export function addMenu(params) {
    return post('/app/sysRoleMenu/addList',params)
}