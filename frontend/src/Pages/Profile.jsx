import React, { use, useEffect, useState } from 'react'
import Service from '../utils/http'
import { Avatar, Center, Paper, Text } from '@mantine/core';
const obj = new Service();

export default function Profile() {
   const [user, setUser] = useState({})
   const getData = async () => {
       try {
           let data = await obj.get("user/me")
           console.log(data)
           setUser(data)
       } catch (error) {
           console.log(error);
       }
   }
   useEffect(() => {
       getData();
   }, [])


   return (        
         <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      
       <Avatar color="blue" size={220} radius={220}  mx="auto">{user?.Avatar}</Avatar>
      
      
      <Text ta="center" fz="xl" fw={500} mt="md">
        {user.name}
      </Text>
      <Text ta="center" fz="md" fw={500} mt="md">
        Account Id :{user._id}
      </Text>
      <Text ta="center" fz="md" fw={500} mt="md">
        Account Created :{user.createdAt}
      </Text>
      <Text ta="center" fz="sm">
        Email : {user.email}
      </Text>
      <Text ta="center"  fz="md">
        Role : {user?.role}
      </Text>
      
      

    </Paper>
   )
}
