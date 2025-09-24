import React, { useState } from 'react'
import Service from '../utils/http'
import UrlResponse from '../Components/UrlResponse';
import UrlForm from '../Components/UrlForm';
import { Container } from '@mantine/core';


export default function UrlShortner() {

    const [response,setResponse]=useState(null)

  return (
    <Container>
        {response?<UrlResponse setResponse={setResponse}res={response}/>:<UrlForm setResponse={setResponse}/>}
    </Container>
  )
}
