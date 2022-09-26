import {
    Button,
    Table,
    Tag,
    Modal
} from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {

    const [dataSource, setDataSource] = useState([])

    // here is using state to update in the table, not a filter way.
    useEffect(() => {
        loadData()
    }, [dataSource])

    const loadData =() => {
        axios.get("/rights?_embed=children")
        .then(res => {
            const rightLists = res.data
            rightLists.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })
            setDataSource(rightLists)
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',

        },
        {
            title: 'Right Title',
            dataIndex: 'title',
        },
        {
            title: 'Right Path',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
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
                        <Button type="primary" shape="circle" icon={<EditOutlined />} />
                    </div>
                )
            }
        },
    ];

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
        if (item.grade === 1) {
            //setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
            // here is using state to update in the table, not a filter way.
            loadData()
        } else {
            //console.log(item.rightId)
            let list = dataSource.filter(data => data.id === item.rightId)
            //console.log(list)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            //console.log(list, dataSource)
            setDataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
