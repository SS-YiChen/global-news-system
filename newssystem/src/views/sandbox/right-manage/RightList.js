import {
    Button,
    Table,
    Tag,
    Modal,
    Popover,
    Switch
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

    useEffect(() => {
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
    }, [])

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
                        <Popover
                            content={
                                <div style={{ textAlign: "center" }}>
                                    <Switch 
                                        checked={item.pagepermisson}
                                        onChange={() => switchMethod(item)}
                                    />
                                </div>
                            }
                            title="Page Configuration"
                            trigger={item.pagepermisson === undefined ? '' : 'click'}
                        >
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                disabled={item.pagepermisson === undefined}
                            />
                        </Popover>
                    </div>
                )
            }
        },
    ];

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson ===1? 0 : 1
        //console.log(item)
        setDataSource([...dataSource])
        if(item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`/children/${item.id}`, {
                pagepermisson:item.pagepermisson
            })
        }
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
        if (item.grade === 1) {
            // here's using the filter way to update data in the table, not a state way 
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
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
