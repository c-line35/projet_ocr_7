import React, { useState, useContext } from 'react';
import { Button, Form, Input, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';

const contentRegexp = new RegExp(/^[a-z0-9\séèçêëàù'\-,":{}]{1,2000}$/i)

const NewPostBis = () => {

    const { authProfil, reqInstance} = useContext(authContext)
    const { id, pseudo }= authProfil

    const { getAllPosts} = useContext(postsContext)
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [content, setContent] = useState({});
    const [file, setFile] = useState("");

    const handleCancel = () => {
        setIsModalVisible(false);
    };

   const showModal = (e) => {
        setIsModalVisible(true);
    };

    const normFile = (e) => {
        setFile(e.file)
    };

    const getContent = (e)=>{
        setContent(e.target.value)
    }
    
    const onFinish = () => {
       const data = {
            userId: id,
            userPseudo: pseudo,
            content: content
        }
        const form = new FormData()
        form.append('image', file);
        form.append('data', JSON.stringify(data))

        reqInstance.post(
            `/posts`, 
            form
        )
        .then(()=>{
            setContent("")
            setFile("")
            getAllPosts()
            setIsModalVisible(false)
        }) 
      };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='newPost'>
           <Button type="primary" onClick={showModal}>Nouveau message </Button>
            <Modal 
            title="Nouveau message" 
            visible={isModalVisible} 
            destroyOnClose={true}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={onFinish}>
                Publier
                </Button>,
            ]}
            >
                <Form
                 onFinish={onFinish}
                 onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="content"
                        onChange ={getContent}
                        rules={[
                        {
                            required: true,
                            message: "Oups, vous avez oublié d'écrire un message!",
                        },
                        {
                            pattern: contentRegexp,
                            message:"Certains caractères spéciaux sont interdits dans votre message"
                        }
                        ]}
                    >
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    
                    >
                        <Upload 
                        name="image" 
                        listType="picture"  
                        maxCount = {1}
                        beforeUpload="false"
                    >
                        <Button icon={<UploadOutlined />}>Choisir une image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal> 
        </div> 
    );
};

export default NewPostBis;