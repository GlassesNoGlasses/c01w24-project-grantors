import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import UserController from '../../controllers/UserController'
import { Application } from '../../interfaces/Application'
import { User } from '../../interfaces/User'
import { DisplayUserStats } from '../grant-stats-page/GrantStatsPage'

const GranteeStats = ({account}: {account: User | undefined}) => {

    return (
        <DisplayUserStats optionalUser={account}/>
    )
}

export default GranteeStats