import {
  Button,
  Table,
  Modal,
  Switch,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

const { confirm } = Modal;

export default function UserList() {

  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState([])

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId, region, username} = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleObj = {
      "1":"superadmin",
      "2":"regional-admin",
      "3":"region-editor",
    }
    axios.get("/users?_expand=role")
      .then(res => {
        const list = res.data
        setDataSource(roleObj[roleId] === "superadmin"? list: [
          ...list.filter(item => item.username === username),
          ...list.filter(item => item.region === region && roleObj[item.roleId]==="region-editor")
        ])
      })
  }, [roleId, region, username])

  useEffect(() => {
    axios.get("/regions")
      .then(res => {
        setRegionList(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get("/roles")
      .then(res => {
        setRoleList(res.data)
      })
  }, [])

  const columns = [
    {
      title: 'Region Area',
      dataIndex: 'region',
      filters: [
        {
          text:"Global",
          value:"Global"
        },
         ...regionList.map( item => ({
          text:item.title,
          value:item.value
         }))
      ],
      //onFilter: (value, item) => item.region.startsWith(value),
      onFilter: (value, item) => {
        if(value === "Global"){
          // global's value in databae is ""
          return item.region === ""
        }
        return item.region === value
      }, 
      render: (region) => {
        return <b>{region === "" ? "Global" : region}</b>
      }
    },
    {
      title: 'User Title',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: 'User Name',
      dataIndex: 'username',
    },
    {
      title: 'User State',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}
          onChange={() => handleChange(item)}
        ></Switch>
      }
    },
    {
      title: 'Handle',
      render: (item) => {
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={item.default}
              onClick={() => showConfirm(item)}
            />

            <Button
              type="primary"
              shape="circle"
              disabled={item.default}
              icon={<EditOutlined />}
              onClick={() => {
                setIsUpdateVisible(true)
                handleUpdate(item)
              }}
            />
          </div>
        )
      }
    },
  ];

  // update user infos
  const handleUpdate = (item) => {
    // let them hanppend syncly so using setTiemout(async function)
    // if not, it will have error cos it has not updated in datasource 
    setTimeout(() => {
      //setIsUpdateVisible(true) // if set Ture here, it's error (same reason)
      if (item.roleId === 1){
        // disabled
        setIsUpdateDisabled(true)
      }else {
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)

    setCurrent(item)
  }

  //update user state
  const handleChange = (item) => {
    //console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])

    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const showConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        //console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    //console.log(item)
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOk = () => {
    //console.log('added', addForm)
    // get value from form and here to fetch the from values
    addForm.current.validateFields().then(value => {
      //console.log(value)
      setIsAddVisible(false)
      //reset form after submitting
      addForm.current.resetFields()
      // post to backend, and generate ID, then set the datasource
      // this way is easier to CRUD
      axios.post("/users", {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        //console.log(res.data)
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(error => {
      console.log(error)
    })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then( value => {
      //console.log(value)
      setIsUpdateVisible(false)

      setDataSource(dataSource.map (item => {
        if(item.id === current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`, value)
    })
  }

  return (
    <div>
      <Button
        type='primary'
        onClick={() => setIsAddVisible(true)}
      >
        ADD USER
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />

      {/* add a user form  */}
      <Modal
        open={isAddVisible}
        title="Add A User"
        okText="Confirm"
        cancelText="Cancel"
        onCancel={() => setIsAddVisible(false)}
        onOk={() => { addFormOk() }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addForm}
        />
      </Modal>

      {/* update a user form */}
      <Modal
        open={isUpdateVisible}
        title="Update The User"
        okText="Update"
        cancelText="Cancel"
        onCancel={() =>{ 
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => { updateFormOk() }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          // purpose: to distinguish/recognize the opening form is for adding or updating 
          // cos they use the same userForm to do response
          isUpdate={true}
        />
      </Modal>

    </div>
  )
}
