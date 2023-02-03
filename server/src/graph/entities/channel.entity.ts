import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryColumn()
  public id: string;

  @Column()
  public capacity: number;

  @Column()
  public transaction_id: string;

  @Column()
  public updated_at: Date;

  @Column()
  public source_public_key: string;

  @Column()
  public target_public_key: string;
}
