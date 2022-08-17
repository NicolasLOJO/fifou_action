import { Alert, Card, Drawer } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Action } from "../action/action";
import { useSocket } from "../hooks/useSocket";
import { Login } from "../login/login";
import { Queue } from "../queue/queue";

interface HomeState {
    username: string;
    action: string[];
    queue: any[];
    activAxis: [number, number],
    error: string | null
}

export class Home extends React.Component<{}, HomeState> {
    socket = useSocket();
    timeout: any = null;  // missing nodejs type
    constructor(props: {}) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleActionSelect = this.handleActionSelect.bind(this);
        this.state = {
            username: '',
            action: [],
            queue: [],
            activAxis: [10, 10],
            error: null
        }
    }

    componentDidMount() {
        fetch('action').then((response) => response.json())
            .then((response) => {
                this.setState({
                    ...this.state,
                    action: response.result
                })
            }, (err) => {
                console.log(err);
            })
        this.socket.on('queue/list', (res) => {
            this.setState({
                ...this.state,
                queue: res
            })
        })
        this.socket.on('queue/action', (res) => {
            let [x, y] = this.state.activAxis;
            let error = null;
            switch (res) {
                case 'up':
                    if (--x < 19) x = 0;
                    break;
                case 'down':
                    if (++x > 0) x = 19;
                    break;
                case 'right':
                    if (++y > 19) y = 0;
                    break;
                case 'left':
                    if (--y < 0) y = 19;
                    break;
                default:
                    error = res;
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(() => {
                        this.setState({
                            ...this.state,
                            error: null
                        })
                    }, 5000);
                    break;
            }
            this.setState({
                ...this.state,
                activAxis: [x, y],
                error: error
            })
        })
    }

    handleActionSelect(action: string) {
        const header = new Headers();
        header.append('x-user-api', this.state.username);
        fetch(`action/${action}/queue`, {
            headers: header
        }).then((res) => res.json()).then((res) => console.log(res), (err) => console.log(err))
    }

    handleLogin(username: string) {
        this.setState({
            username
        })
        this.socket.emit('init', username);
    }

    isActive(y: number, x: number) {
        const style = { flex: 1, background: 'blue', m: '5px', width: '25px', height: '25px', borderRadius: '5px' };
        if (x === this.state.activAxis[0] && y === this.state.activAxis[1]) {
            style.background = 'green';
        }
        return style;
    }

    render(): React.ReactNode {
        return <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
            <Box sx={{ flex: 1, gap: 5, m: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {this.state.error !== null && <Alert severity="error">{this.state.error}</Alert>}
                    <Box sx={{ flex: 1, alignSelf: 'center', width: '80%' }}>
                        {this.state.username === '' && <Login handleLogin={this.handleLogin}></Login>}
                        {this.state.username !== '' && <Box sx={{ display: "flex", flexDirection: 'row', gap: 5 }}>
                            <Card sx={{ width: '100%', p: 5 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {this.state.action.map(a => (
                                        <Box key={a} sx={{ flex: 0 }}>
                                            <Action key={a} action={a} handleClick={this.handleActionSelect}></Action>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        </Box>}
                    </Box>
                    <Box sx={{ flex: 1, alignSelf: 'center', width: '80%' }}>
                        {(new Array(20)).fill(0).map((x, i) => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                {(new Array(20)).fill(0).map((xx: undefined, ii: number) => (
                                    <Box key={`${i}_${ii}`} sx={this.isActive(ii, i)}></Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Drawer
                sx={{
                    width: 350, flexShrink: 0, '& .MuiDrawer-paper': {
                        width: 350,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="right"
                open
            >
                {this.state.queue.length > 0 && this.state.queue.map((x, i) => (<Queue key={i} item={x}></Queue>))}
            </Drawer>
        </Box>
    }
}