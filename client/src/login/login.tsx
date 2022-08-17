import { Box, Button, Card, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent } from "react";

interface LoginState {
    username: string
}

interface LoginProps {
    handleLogin: (login: string) => void
}

export class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.state = {
            username: ''
        }
    }

    handleUsername(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            username: event.target.value
        })
    }

    handleLogin(event: FormEvent) {
        event.preventDefault();
        this.props.handleLogin(this.state.username)
    }
    render(): React.ReactNode {
        return <Card variant="elevation" sx={{ p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                    <form onSubmit={this.handleLogin}>
                        <TextField sx={{ width: '100%', m: '5px' }} label="username" variant="outlined" value={this.state.username} onChange={this.handleUsername} />
                        <Button variant="outlined" sx={{ width: "100%", m: '5px' }} type="submit">Loggin</Button>
                    </form>
                </Box>
            </Box>
        </Card >
    }
}