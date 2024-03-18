import { useEffect, useState } from 'react'
import { NavBarSettingsProps } from './NavBarSettingsProps'
import burger from '../../images/burger.png'
import openSideMenu from '../../images/openSideMenu.png'
import { useUserContext } from '../contexts/userContext'
import { Link } from 'react-router-dom'

const NavBarSettings = ({

}: NavBarSettingsProps) => {

  // States Used
	const [sideMenuOn, setSideMenuOn] = useState<boolean>(false);
	const [sideMenuDisplay, setSideMenuDisplay] = useState<string>("none");
	const [sideMenuIcon, setSideMenuIcon] = useState<string>(burger);

	const {user, setUser} = useUserContext();

	// Update states upon sideMenuOn state change
	useEffect(() => {
		console.log("changed", sideMenuOn);
		if (sideMenuOn) {
			setSideMenuDisplay("block");
			setSideMenuIcon(openSideMenu);
		} else {
			setSideMenuDisplay("none");
			setSideMenuIcon(burger);
		};
	}, [sideMenuOn]);

	// Styling
	const styles = { // TODO: Replace with tailwind
		iconStyles: {
			height: "40px",
			width: "auto",
			borderWidth: "medium",
			borderColor: "rgb(141, 229, 100)",
		},
		sideMenuStyles: {
			display: sideMenuDisplay,
			height: "fit-content",
			backgroundColor: "papayawhip",
			borderColor: "burlywood",
			borderWidth: "medium",
			borderStyle: "ridge",
		}
	};

	return (
		<div>
			<button className='hover:bg-green-200' onClick={() => setSideMenuOn(prev => prev ? false : true)}>
				<img src={sideMenuIcon} style={styles.iconStyles}></img>
			</button>
			<div className="absolute hover:brightness-110" style={styles.sideMenuStyles}>
				<Link to="/">
					<button onClick={() => setUser(null)}>Sign Out</button>
				</Link>
			</div>
		</div>
	)
}

export default NavBarSettings
