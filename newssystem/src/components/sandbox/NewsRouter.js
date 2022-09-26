import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NoPerssion from '../../views/sandbox/noperssion/NoPerssion'
import Offline from '../../views/sandbox/publish-manage/Offline'
import Published from '../../views/sandbox/publish-manage/Published'
import UnPublished from '../../views/sandbox/publish-manage/UnPublished'
import Review from '../../views/sandbox/review-manage/Review'
import ReviewList from '../../views/sandbox/review-manage/ReviewList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit":<Review />,
    "/audit-manage/list": <ReviewList />,
    "/publish-manage/unpublished": <UnPublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Offline />,
}

export default function NewsRouter() {

    const [backRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            //console.log(res)
            setBackRouteList([...res[0].data, ...res[1].data])

        })
    }, [])
    //console.log(backRouteList)

    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))


    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && item.pagepermisson
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        // <Routes>
        //     <Route path="/home" element={<Home />} />
        //     <Route path="/user-manage/list" element={<UserList />} />
        //     <Route path="/right-manage/role/list" element={<RoleList />} />
        //     <Route path="/right-manage/right/list" element={<RightList />} />
        //     {/* all other urls redirect to login page */}
        //     <Route path="*" element={<NoPerssion />} />
        // </Routes>

        <Routes>
            {
                backRouteList.map(item =>
                    {
                        if(checkRoute(item) && checkUserPermission(item)){
                            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} />
                        }
                        return  <Route key={item.key} element={<NoPerssion />} />
                    }
                )
            }
            
            {
                backRouteList.length > 0 && <Route path="*" element={<NoPerssion />} />
            }
        </Routes>
    )
}
