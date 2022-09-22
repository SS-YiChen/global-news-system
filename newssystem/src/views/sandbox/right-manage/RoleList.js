import {
    Button,
    Table,
    Tag,
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
                            onClick={() => setIsModalOpen(true)}
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
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }

    useEffect(() => {
        axios.get('http://localhost:5000/roles')
            .then(res => {
                //console.log(res.data)
                setDataSource(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children")
            .then(res => {
                //console.log(res.data)
                setRightList(res.data)
            })
    }, [])

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
