
import React from 'react'
import { AdminNavProps } from './AdminNavProps'
import NavBarSettings from '../NavBarSettings';

const AdminNav = ({
    user,
}: AdminNavProps) => {
    
    const GenerateUserTitle = (): JSX.Element => {
        const title = `Welcome, ${user?.username}!`;

        return (
            <h2 style={{fontSize: "x-large"}}>
                {title}
            </h2>
        )
    };


    return (
        <div style={styles.NavStyles}>
            <div>
                {GenerateUserTitle()}
            </div>
            <br></br>
            <div>
                <NavBarSettings />
            </div>
        </div>
    )
}

export default AdminNav


const styles = {
    NavStyles: {
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingLeft: "2%",
    }
}
