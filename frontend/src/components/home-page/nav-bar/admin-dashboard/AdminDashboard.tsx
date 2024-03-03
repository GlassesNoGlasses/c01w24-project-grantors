import React from 'react'
import { AdminDashboardProps } from './AdminDashboardProps'
import { useUserContext } from '../../../contexts/userContext'
import ButtonIcon from '../../../displays/ButtonIcon/ButtonIcon';
import addIcon from '../../../../images/addIcon.svg'
import logoutIcon from '../../../../images/logout.svg'
import userIcon from '../../../../images/user.svg'
import settingsIcon from '../../../../images/settings.svg'
import ApplicationIcon from '../../../displays/ApplicationIcon/ApplicationIcon';
import list from '../../../../images/list.png'
import search from '../../../../images/search.png'
import { Link } from 'react-router-dom';

const AdminDashboard = ({

  }: AdminDashboardProps) => {

    // States used
    const {user, setUser} = useUserContext();

    const GenerateWelcomeMessage = (): JSX.Element => {
      const message = `Welcome: ${user?.username}!`;

      return (
        <div style={styles.userIntroStyle}>
          {message}
        </div>
      )
    }

  return (
    <div className="dashboard-container" style={styles.dashboardContainer}>
      <div className="admin-intro">
          {GenerateWelcomeMessage()}
      </div>
      <div className="admin-options" style={styles.iconOptionStyles}>
        <ButtonIcon imageSrc={addIcon} label={"New Grant"}/>
        <ButtonIcon imageSrc={userIcon} label={"My Account"}/>
        <ButtonIcon imageSrc={settingsIcon} label={"Settings"}/>
        <Link to="/">
          <ButtonIcon imageSrc={logoutIcon} label={"Log Out"} callback={() => setUser(null)}/>
        </Link>
      </div>
      <div className="application-options" style={styles.applicationOptionStyles}>
        <ApplicationIcon imageSrc={list} label={"View Hosted Grants"}/>
        <ApplicationIcon imageSrc={search} label={"Review Applications"}/>
      </div>
    </div>
  )
}

export default AdminDashboard

// Styling
const styles = {
  dashboardContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgb(141, 229, 100)",
    overflowY: "auto" as "auto"
  },
  userIntroStyle: {
    fontSize: "5vw",
    textDecoration: "underline",
    textAlign: "left" as "left",
    color: "white",
    paddingLeft: "2%",
    fontWeight: "bold",
  },
  iconOptionStyles: {
    display: "flex",
    height: "30%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  applicationOptionStyles: {
    display: "flex",
    height: "40%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  }
}
