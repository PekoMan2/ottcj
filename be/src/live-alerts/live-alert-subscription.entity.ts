import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type LiveAlertChannel = 'email' | 'sms';
export type LiveAlertStatus = 'pending' | 'synced' | 'rejected';

@Entity({ name: 'live_alert_subscriptions' })
@Index(['channel', 'status', 'expiresAt'])
export class LiveAlertSubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 8, type: 'varchar' })
  channel!: LiveAlertChannel;

  @Column({ name: 'first_name_encrypted', type: 'text' })
  firstNameEncrypted!: string;

  @Column({ name: 'last_name_encrypted', type: 'text' })
  lastNameEncrypted!: string;

  @Column({ name: 'contact_encrypted', type: 'text' })
  contactEncrypted!: string;

  @Index({ unique: true })
  @Column({ length: 64, name: 'contact_fingerprint', type: 'varchar' })
  contactFingerprint!: string;

  @Column({ length: 64, name: 'consent_version', type: 'varchar' })
  consentVersion!: string;

  @Column({ length: 12, type: 'varchar' })
  status!: LiveAlertStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;
}
