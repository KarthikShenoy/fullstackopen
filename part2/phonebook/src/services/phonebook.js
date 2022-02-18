import axios from "axios";

const PERSONS_URL = 'http://localhost:3001/persons'
const getAll = () => axios
    .get(PERSONS_URL)
    .then(response => response.data)

const create = (person) =>
    axios.post(PERSONS_URL, person)
        .then(response => {
            console.log(`Created in server ${response.data}`)
            return response.data
        })
const update = (person) =>
    axios.put(`${PERSONS_URL}/${person.id}`, person)
        .then(response => {
            console.log(`Updated in server ${response.data}`)
            return response.data
        })
const deleteUser = (id) => axios
    .delete(`${PERSONS_URL}/${id}`)
    .then(response => response.data)

export default { getAll, create, deleteUser,update }