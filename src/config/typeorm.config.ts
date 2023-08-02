import { DataSource } from "typeorm";
import { typeOrmConfig } from "./database.config";

const dataSource = new DataSource(typeOrmConfig());

export default dataSource;