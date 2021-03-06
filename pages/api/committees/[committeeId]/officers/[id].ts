import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import User from '@models/user'

const officerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)

	try {
		await dbConnect()

		switch (req.method) {
			case 'PATCH': {
				await Committee.updateOne(
					{ _id: req.query.committeeId },
					{ $set: { 'officers.$[idx].image': req.body.image } },
					{ arrayFilters: [{ 'idx.user': req.query.id }] }
				)

				if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {					
					await User.updateOne({ _id: req.query.id }, { userType: req.body.userType })
				}
				break
			}

			case 'DELETE': {
				await Committee.updateOne(
					{ _id: req.query.committeeId },
					{ $pull: { officers: { user: req.query.id } } },
				)
				break
			}

			default:
				res.setHeader('Allow', ['PATCH', 'DELETE'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default officerHandler