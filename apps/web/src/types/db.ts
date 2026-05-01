import type { RecordModel, RecordAuthResponse } from 'pocketbase';

export interface User {
	id: string;
	created: string;
	updated: string;
	username: string;
	email?: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
}

export type UserRecordModel = RecordModel & User;
export type UserAuthRefresh = RecordAuthResponse<UserRecordModel>;

export interface Post {
	id: string;
	created: string;
	updated: string;
	user: string;
	count: number;
	expand?: { user: User };
}

export type PostRecordModel = RecordModel & Post;
