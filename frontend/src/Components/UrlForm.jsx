import { Button, Card, Container, Text, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import Service from '../utils/http';


export default function UrlForm(props) {
    const [data, setData] = useState({
        "originalUrl": "",
        "customUrl": "",
        "title": "",
        "expiresAt": "",
    })
    let ser = new Service();
    const generateUrl = async (data) => {
        try{
        //    console.log(data)
         let res=await ser.post("url", data)
        //  console.log(res)
            props.setResponse(res)
        }catch(er){
            console.log(er);
        }
        
    }
    return (
        <Container mt="lg" >
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
            <Text size="xl" fw="bold"  variant="gradient" align="center">Shorten Your URL</Text>
            <TextInput
            withAsterisk
                variant="filled"
                size="lg"
                radius="md"
                label="Original Url"
                placeholder="Enter Original Url"
                type='url'
                onChange={(e) => {
                    setData({ ...data, originalUrl: e.target.value })
                }}
            />
            <TextInput
                variant="filled"
                size="lg"
                radius="md"
                label="Custom Url"
                placeholder="Enter Custom Url"
                onChange={(e) => {
                    setData({ ...data, customUrl: e.target.value })
                }}
            />
            <TextInput
                variant="filled"
                size="lg"
                radius="md"
                label="Title"
                placeholder="Enter Title"
                onChange={(e) => {
                    setData({ ...data, title: e.target.value })
                }}
            />
            <TextInput
                variant="filled"
                size="lg"
                radius="md"
                label="Expiry Date"
                placeholder="Choose Expiry Date"
                type='date'
                onChange={(e) => {
                    setData({ ...data, expiresAt: e.target.value })
                }}
            />
            <Button
                fullWidth
                disabled={!data.originalUrl.length > 10}
                mt='lg'
                color="red"
                radius="md"
                onClick={()=>{generateUrl(data)}}
            >Generate Short Url</Button>
            </Card>
        </Container>
        
    )
}
