import { Card, Typography } from "@mui/material";
import React from "react";
interface QueueProps {
    item: any;
}
export class Queue extends React.Component<QueueProps, {}> {
    constructor(props: QueueProps) {
        super(props)
    }

    render(): React.ReactNode {
        return <Card sx={{ m: '5px', p: '5px' }}>
            <Typography>{this.props.item.name}</Typography>
        </Card>
    }
}