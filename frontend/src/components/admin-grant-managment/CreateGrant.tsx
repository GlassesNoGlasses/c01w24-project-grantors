import GrantForm from './GrantForm';
import { GrantFormType } from './GrantFormProps';

const CreateGrant = () => {
	return (
		<GrantForm type={GrantFormType.CREATE}/>
	);
};

export default CreateGrant;