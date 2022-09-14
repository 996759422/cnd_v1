import request from "@/utils/request";

export const getTopicsList = (params) => {
    return request.get('/topics', { params })
}

export const getTopicById = (params) => {
    return request.get('/topic/' + params.id, { params })
}


// 新建主题
export const addTopic = (data) => {
    return request.post('/topics', data)
}


