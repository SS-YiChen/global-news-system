import { Button } from 'antd'
import React from 'react'
import axios from 'axios'

export default function Home() {
    const data = () =>{
        axios.get('http://localhost:8000/posts')
            .then( res => {
                console.log(res.data)
            })
    }
  return (
    <div>
        <Button type='primary' onClick={data}>Button</Button>
    </div>
  )
}
