import type { RecordModel } from 'pocketbase';

export interface AuthContext {
	token: string;
	user: RecordModel | null;
}
