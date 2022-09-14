import request from "@/utils/request";
// 新建评论
export const replyTopicById = (data) => {
    return request.post(`/topic/${data.id}/replies`, data)
}

// 评论点赞
export const goodReplyById = (data) => {
    return request.post(`/reply/${data.id}/ups`, data)
}