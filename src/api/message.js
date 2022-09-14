import request from "@/utils/request";
// 获取未读消息数
export const getMessageCount = (params) => {
    return request.get('/message/count/', { params })
}
// 获取未读消息
export const getMessages = (params) => {
    return request.get('/messages', { params })
}
// 标记单个消息为已读
export const markOneMessage = (data) => {
    return request.post(`/message/mark_one/${data.msg_id}`, data)
}
// 标记全部已读
export const markAllMessages = (data) => {
    return request.post('/message/mark_all', data)
}

