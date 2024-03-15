import GrantForm from './GrantForm';

const SERVER_PORT = 8000

const CreateGrant = () => {
  return (
    <GrantForm port={SERVER_PORT} type='create'/>
  )
}

export default CreateGrant