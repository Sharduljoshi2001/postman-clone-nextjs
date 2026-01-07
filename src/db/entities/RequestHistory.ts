import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
@Entity()
export class RequestHistory {
  @PrimaryKey()
  id!: number;
  @Property()
  url!: string;
  @Property()
  method!: string; //get, post, put, delete
  //using 'json' type to store flexible data like request body
  @Property({ type: 'json', nullable: true })
  body?: object;
  @Property({ type: 'json', nullable: true })
  headers?: object;
  @Property()
  statusCode!: number;
  @Property()
  duration!: number; //time taken in milliseconds
  @Property()
  createdAt: Date = new Date();
}