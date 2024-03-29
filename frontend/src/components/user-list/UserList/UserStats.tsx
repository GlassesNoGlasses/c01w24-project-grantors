import { User } from '../../../interfaces/User'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import UserController from '../../../controllers/UserController'
import GranteeStats from '../GranteeStats'

const UserStats = () => {

    const { userID } = useParams()
    const [account, setAccount] = useState<User>()

    const setInitUser = async () => {
        if (userID) {
            const user = await UserController.fetchAUser(userID)
            if (!user) {return}
            setAccount(user)
        }
    }
    
    useEffect(() =>{
        setInitUser()
    }, [])

    if (!account) return <div> account not found</div>

    return (
        account.isAdmin ? <div>admin stats</div> : <GranteeStats account={account}/> 
     )
}

export default UserStats