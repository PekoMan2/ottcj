import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export type EventPhase = 'pre' | 'live' | 'post';
export type EventResultStatus = 'finished' | 'dnf';

@Entity({ name: 'event_state' })
export class EventStateEntity {
  @PrimaryColumn({ type: 'smallint' })
  id!: number;

  @Column({ length: 8, type: 'varchar' })
  phase!: EventPhase;

  @Column({ name: 'event_start_at', type: 'timestamptz' })
  eventStartAt!: Date;

  @Column({
    length: 2048,
    name: 'live_track_url',
    nullable: true,
    type: 'varchar',
  })
  liveTrackUrl!: string | null;

  @Column({
    length: 12,
    name: 'result_status',
    nullable: true,
    type: 'varchar',
  })
  resultStatus!: EventResultStatus | null;

  @Column({ name: 'elapsed_seconds', nullable: true, type: 'integer' })
  elapsedSeconds!: number | null;

  @Column({
    name: 'final_donation_total_cents',
    nullable: true,
    type: 'integer',
  })
  finalDonationTotalCents!: number | null;

  @Column({ name: 'result_copy', nullable: true, type: 'text' })
  resultCopy!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
