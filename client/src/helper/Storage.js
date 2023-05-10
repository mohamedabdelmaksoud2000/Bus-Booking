

export const setAuthUser = (data) => {

    localStorage.setItem('user',JSON.stringify(data));
};

export const getAuthUser = () =>{
    if(localStorage.getItem('user'))
    {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export const removeAuthUser = () =>{
    if(localStorage.getItem('user'))
    {
        localStorage.removeItem('user');
    }
}

export const getHeader = () =>{
    const auth = getAuthUser();

    const config = {
        headers:{
            role: auth.role,
            token: auth.token,
        }
    };

    return config;
}