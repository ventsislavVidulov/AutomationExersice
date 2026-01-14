export type LoginCredentials = {
    email: string,
    password: string,
    userFullName: string
}

export type AccountDetails = {
    gender: 'male' | 'female',
    password: string,
    day: string,
    month: string,
    year: string,
    newsletter: boolean,
    option: boolean
}

export type AddressDetails = {
    firstName: string,
    lastName: string,
    address1: string,
    country: string,
    state: string,
    city: string,
    zip: string,
    mobile: string
}
