import { Button } from "@mui/material";
import React from "react";
interface ActionProps {
    action: string,
    handleClick: (action: string) => void
}
export class Action extends React.Component<ActionProps> {
    constructor(props: ActionProps) {
        super(props)
    }

    render(): React.ReactNode {
        return <Button variant="contained" onClick={() => this.props.handleClick(this.props.action)}>
            {this.props.action}
        </Button>
    }
}