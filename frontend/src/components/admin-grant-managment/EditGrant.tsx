import GrantForm from './GrantForm'
import { GrantFormType } from './GrantFormProps';

const EditGrant = () => {
    return (
        <GrantForm type={GrantFormType.EDIT} />
    );
};

export default EditGrant