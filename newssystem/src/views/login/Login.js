import React from 'react'
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import ParticlesBg from 'particles-bg'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate()

  const onFinish = (values) => {
    //console.log(values)
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
      .then(res => {
        //console.log(res.data)
        if (res.data.length === 0) {
          message.error("username and password are NOT matched!")
        } else {
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          navigate('/home')
        }
      })
  }

  return (
    <div >
      <ParticlesBg type="circle" bg={true} />
      <div className="formContainer">
        <div className="logintitle">Global News Management</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
