const characters = 'A-Za-zÀ-ÖØ-öø-ÿ';

export const name = new RegExp(`^[${characters}]+([ '-][${characters}]+)*$`);

export const slug = /^[a-z0-9]([-_a-z0-9]*[a-z0-9])?$/;

export const objectId = /^[A-Fa-f0-9]{24}$/;

export const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{14,}$/;

export const url = /((www.)?)([a-zA-z0-9\-_]+)(.com)/;

export const email =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
