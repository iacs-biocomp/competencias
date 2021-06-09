import {
	BaseEntity,
	Entity,
	Column,
	JoinTable,
	ManyToMany,
	UpdateDateColumn,
	CreateDateColumn,
	PrimaryColumn,
	OneToOne,
} from 'typeorm';
import { SignupDto } from '../modules/auth/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Trabajador } from './index';
import { IUserJson } from 'sharedInterfaces/Entity';

@Entity('user')
export class User extends BaseEntity implements IUserJson {
	@ApiProperty()
	@PrimaryColumn({ type: 'varchar', unique: true, length: 40, nullable: false })
	username: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	password: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: true })
	email?: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: true })
	name?: string;

	@ApiProperty()
	@Column({ type: 'varchar', nullable: false })
	lastname: string;

	@ApiProperty()
	@CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
	createdAt?: Date;

	@ApiProperty()
	@UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
	updatedAt?: Date;

	@ApiProperty({ type: () => Role })
	@ManyToMany(type => Role, role => role.users, { eager: true })
	@JoinTable({ name: 'user_roles' })
	roles: Role[];

	@ApiProperty()
	@Column({ type: 'bool', default: false })
	active: boolean;

	@ApiProperty({ type: () => Trabajador })
	@OneToOne(type => Trabajador, t => t.user)
	trabajador?: Trabajador;

	/**
	 * This function creates a new user instance for save the user to database, use only for register
	 * @param usr User from signupDto, must ve valid
	 */
	public static buildFromRegister(usr: SignupDto): User {
		var user = new User();
		user.username = usr.username;
		user.password = usr.password;
		user.name = usr.name;
		user.lastname = usr.surnames;
		user.email = usr.email;
		return user;
	}
}
