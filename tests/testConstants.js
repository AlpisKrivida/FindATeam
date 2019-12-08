const userOne = {
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'fasfasf'
}

const userOneIncorrectPassword = {
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'fasfassfsff'
}

const userTwo = {
    name: 'asdfgh',
    email: 'asdfgh@gmail.com',
    password: 'asdfgh'
}

const userThree = {
    name: 'asdfghf',
    email: 'asdfgfh@gmail.com',
    password: 'asdffgh'
}

const admin = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'fasfassff'
}

const empty = {
    name: '',
    email: '',
    password: ''
}

const doesntexists = {
    name: 'Adminfsfs',
    email: 'adminfsfs@gmail.com',
    password: 'fasfassfffsfsf'
}

module.exports = {
    userOne,
    userOneIncorrectPassword,
    userTwo,
    userThree,
    admin,
    empty,
    doesntexists
}