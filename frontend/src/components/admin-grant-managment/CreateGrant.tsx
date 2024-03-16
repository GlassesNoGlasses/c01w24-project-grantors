import { SERVER_PORT } from '../../constants/ServerConstants';
import GrantForm from './GrantForm';

const CreateGrant = () => {
  return (
    <GrantForm port={SERVER_PORT} type='create'/>
  )
}

export default CreateGrant