import api from "./index.js";

//Auth
export const loginUser = (formData)=> api.post("/login", formData);
export const signupUser = (formData)=> api.post("/signup", formData);
export const logoutUser = ()=> api.post("/logout", {});

export const verifyUser = ()=> api.get("/verify");
export const getRecommendedProviders = ()=> api.get("/providers/recommended");
export const getProviders = (category)=> api.get(`/providers?category=${category}`);