import { Router } from "express";
import { Container } from "./Container";

export abstract class Controller {
    router = Router();
    abstract initRouter(container: Container): Router;
}