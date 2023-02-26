import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fee: number;
}
