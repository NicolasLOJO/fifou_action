import { Box, Button, Dialog, DialogTitle, List, ListItem, ListItemButton } from "@mui/material";
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

function ActionDialog(props: any) {
    return <Dialog onClose={props.onClose} open={props.open}>
        <DialogTitle>Choose action</DialogTitle>
        <List>
            {props.list && props.list.map((x: { action: string, credit: number }) => (
                <ListItemButton key={x.action} onClick={() => props.onChoose(x.action)}>{x.action}</ListItemButton>
            ))}
        </List>
    </Dialog>
}

export function Queue(props: any) {
    const [list, setList] = useState<{ action: string, credit: number }[]>([]);
    const [action, setAction] = useState<string>();
    const [queue, setQueue] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    socket.getSocket().on('queue', (queue) => {
        setQueue(queue);
    })
    useEffect(() => {
        fetch('action', { method: 'get' }).then(async (res) => {
            setList(await res.json());
        });
        fetch('queue', { method: 'get' }).then(async (res) => {
            const response = await res.json();
            setQueue(response.queue);
        })
    }, []);

    const handleAction = (action: string) => {
        fetch('/action', {
            method: 'POST',
            body: JSON.stringify({
                action: action,
                username: props.user
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    }

    return <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Box>
            <Button variant="outlined" onClick={() => {
                setOpen(true)
            }}>
                Add action
            </Button>
            <ActionDialog
                list={list}
                onChoose={(action: string) => {
                    handleAction(action);
                    setOpen(false);
                }}
                open={open}
                onClose={() => setOpen(false)}

            />
        </Box>
        <Box>
            <List>
                {queue && queue.map((x, i) => <ListItem key={i}>{x}</ListItem>)}
            </List>
        </Box>
    </Box>
}