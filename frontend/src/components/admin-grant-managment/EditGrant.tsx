import { SERVER_PORT } from '../../constants/ServerConstants'
import GrantForm from './GrantForm'

const EditGrant = () => {
  return (
    <GrantForm port={SERVER_PORT} type='edit' />
  )
}

export default EditGrant