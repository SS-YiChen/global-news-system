import {
    Button,
    Table,
    Modal,
    Tree,
} from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList() {

    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState([])
    const [currentRights, setCurrentRights] = useState([]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            render: (name) => {
                return <i>{name}</i>
            }
        },
        {
            title: 'Handle',
            render: (item) => {
                return (
                    <div>
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />}
                            onClick={() => showConfirm(item)}
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsModalOpen(true)
                                setCurrentRights(item.rights)
                                setCurrentId(item.id)
                            } }
                        />
                    </div>
                )
            }
        },
    ]


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
        axios.delete(`/roles/${item.id}`)
    }

    useEffect(() => {
        axios.get('/roles')
            .then(res => {
                //console.log(res.data)
                setDataSource(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("/rights?_embed=children")
            .then(res => {
                //console.log(res.data)
                setRightList(res.data)
            })
    }, [])

    const handleOk = () => {
        //console.log(currentRights)
        setIsModalOpen(false)
        // sync to datasource 
        setDataSource(dataSource.map(item => {
            if(item.id === currentId){
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        // patch
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onCheck = (checkedKeys, info) => {
        //console.log('onCheck', checkedKeys, info);
        setCurrentRights(checkedKeys.checked)
      };

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
            />
            <Modal title="Permission Assignment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
