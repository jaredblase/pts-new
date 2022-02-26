import { Schema, models, model, Model, Document } from 'mongoose'
import { IAccount } from './account'
import './account' // force import in case of query population

export interface IOfficer {
	account: Schema.Types.ObjectId | IAccount | string;
	name?: string;
	position: string;
	image: string;
}

export interface ICommittee {
	name: string;
	officers: IOfficer[];
}

const committeeSchema = new Schema<ICommittee>({
	name: { type: String, required: true },
	officers: [{
		account: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		position: { type: String, required: true },
		image: { type: String, required: true },
	}]
})

export default models.Committee as Model<ICommittee & Document> || model<ICommittee>('Committee', committeeSchema, 'committees')
