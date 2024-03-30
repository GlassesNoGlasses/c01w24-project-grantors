import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import UserController from '../../controllers/UserController'
import { Application } from '../../interfaces/Application'
import { User } from '../../interfaces/User'
import { DisplayUserStats, DisplayGrantorStats } from '../grant-stats-page/GrantStatsPage'

export const GranteeStats = ({account}: {account: User | undefined}) => {

    return (
        <DisplayUserStats optionalUser={account}/>
    )
}

export const GrantorStats = ({account}: {account: User | undefined}) => {
    return (
        <DisplayGrantorStats optionalUser={account}/>
    )
}