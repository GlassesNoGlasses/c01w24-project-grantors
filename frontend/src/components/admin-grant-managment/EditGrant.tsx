import GrantForm from './GrantForm'

const SERVER_PORT = 8000

const EditGrant = () => {
  return (
    <GrantForm port={SERVER_PORT} type='edit' />
  )
}

export default EditGrant