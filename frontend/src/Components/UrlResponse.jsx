import { ActionIcon, Box, Button, Card, Center, Container, CopyButton, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import Service from '../utils/http'
import QRCode from 'react-qr-code';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useClipboard } from '@mantine/hooks';
const obj = new Service();


export default function UrlResponse(props) {
    const surl = obj.getBaseURL() + '/api/url/' + props?.res?.shortCode;
    const clipboard = useClipboard({ timeout: 500 });
    return (
        
            <Card shadow="sm" padding="s" radius="md" withBorder mt="xl">
                <Text size="xl" fw="bold" variant="gradient" align="center" mb="xl">Shortend URL</Text>

                <Center  mb="xl">
                    <Stack spacing="xs" align="center"  mb="xl">
                        <QRCode value={surl} size={200} />
                        <Text size="sm" c="dimmed">
                            Scan this QR to open the URL
                        </Text>
                    </Stack>
                </Center>
                <TextInput
                    value={surl}
                    rightSection={<IconCopy size={20} style={{ cursor: 'pointer' }}onClick={()=>{
                        console.log("clicked")
                        clipboard.copy(surl)
                    }} />}
                    readOnly
                    mx="auto"
                    mb="xl"
                />
                <Button variant="filled"   mx="auto" onClick={()=>{
                    props.setResponse(null);
                }}>Refresh</Button>;
            </Card>

        
    )
}
