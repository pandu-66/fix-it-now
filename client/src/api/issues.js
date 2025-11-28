import api from "./index.js";

export const getMyIssues = ()=> api.get("/issues/self");

//resident route
export const postNewIssue = (formData)=> api.post("/issues", formData);
export const postIssueRating = (id, rating)=> api.post(`/issues/${id}/rate`, {rating: rating});

//provider routes
export const getRequestedIssues = ()=> api.get("/issues/requests");
export const getBroadcastIssues = ()=> api.get("/issues");
export const acceptIssue = (id)=> api.patch(`/issues/${id}/accept`, {status: "in-progress"});
export const resolveIssue = (id)=> api.patch(`/issues/${id}/status`, {status: "resolved"});
export const cancelIssue = (id)=> api.patch(`/issues/${id}/status`, {status: "pending"});