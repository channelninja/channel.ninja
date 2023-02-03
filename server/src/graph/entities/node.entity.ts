import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Node {
  @PrimaryColumn()
  public public_key: string;

  @Column()
  public alias: string;

  @Column()
  public color: string;

  @Column()
  public sockets: string;

  @Column()
  public updated_at: Date;
}
