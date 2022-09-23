import {
    Form,
    Input,
    Select
} from 'antd'
import React, { forwardRef, useEffect, useState } from 'react'

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {

    const [isDisable, setIsDisable] = useState(false)

    useEffect(() => {
        setIsDisable(props.isUpdateDisabled)
    },[props.isUpdateDisabled])

    const roleObj = {
        "1":"superadmin",
        "2":"regional-admin",
        "3":"regional-editor",
      }

    const {roleId, region } = JSON.parse(localStorage.getItem('token'))

    const checkRegionDisabled = (item) => {
        if(props.isUpdate){
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return true
            }
        }else{
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return item.value !== region
            }
        }
    }

    const checkRoleDisabled = (item) => {
        if(props.isUpdate){
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return true
            }
        }else{
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                //return item.id !== 3
                return roleObj[item.id] !== "regional-editor"
            }
        }
    }

    return (
        <div>
            <Form
                layout="vertical"
                ref={ref}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of user!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the password of user!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="Region Area"
                    rules={ isDisable? []:[
                        {
                            required: true,
                            message: 'Please input the region of user!',
                        },
                    ]}
                >
                    <Select disabled={isDisable}>
                        {props.regionList.map(item => {
                            return <Option 
                                        value={item.value} 
                                        key={item.id} 
                                        disabled={checkRegionDisabled(item)}
                                    >
                                        {item.title}
                                    </Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="User Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the UserTitle of user!',
                        },
                    ]}
                >
                    <Select 
                        onChange={(value) => {
                            //console.log(value)
                            if(value*1 === 1) { // if value is string, *1 changes to number type
                                setIsDisable(true)
                                ref.current.setFieldsValue({
                                    region:""
                                })
                            }else{
                                setIsDisable(false)
                            }
                        }}
                    >
                        {
                        props.roleList.map(item => 
                            <Option key={item.id} value={item.id} disabled={checkRoleDisabled(item)}>
                                {item.roleName}
                            </Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}
)

export default UserForm