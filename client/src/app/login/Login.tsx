import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, FormEvent, useState } from "react";

export function Login(props: { handleLogin: { (username: string): void } }) {
    const [username, setUsername] = useState<string>('')
    const handle = (event: FormEvent) => {
        if (username) {
            props.handleLogin(username);
        }
        event.preventDefault();
    }

    return <form action="login" onSubmit={handle}>
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 5 }}>
            <Box>
                <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(ev) => {
                    setUsername(ev.target.value)
                }} />
            </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 5 }}>
            <Box>
                <Button variant="outlined" type="submit">Login</Button>
            </Box>
        </Box>
    </form>
}