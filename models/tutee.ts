import { Schema, models, model, Model, Document } from 'mongoose'
import { ISchedule } from './schedule'
import { userInfoSchema, IUserInfo } from './user'
import * as yup from 'yup'
import Schedule from './schedule'

export const tuteeInfoSchema = userInfoSchema.shape({
	campus: yup.string().required('Campus is required.'),
	college: yup.string().required('College is required.'),
}).omit(['terms', 'middleName']).required()

export interface ITutee extends Omit<IUserInfo, '_id' | 'terms' | 'middleName'> {
	campus: string
	college: string
	schedule: ISchedule
	friends?: string[]
}

const tuteeSchema = new Schema<ITutee>({
	campus: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	idNumber: { type: Number, required: true },
	email: { type: String, required: true },
	college: { type: String, required: true },
	course: { type: String, required: true },
	contact: { type: String, required: true },
	url: { type: String, required: true },
	friends: [String],
	schedule: {
		type: Schema.Types.ObjectId,
		ref: 'Schedule',
	}
})

tuteeSchema.pre('remove', function(next) {
	Schedule.deleteOne({ _id: this.schedule })
	next()
})

export default models?.Tutee as Model<ITutee & Document> || model<ITutee>('Tutee', tuteeSchema, 'tutees')
