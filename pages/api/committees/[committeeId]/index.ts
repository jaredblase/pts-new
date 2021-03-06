import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@lib/db'
import Committee from '@models/committee'
import Library from '@models/library'

const committeeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req })
	if (session?.user.type != 'ADMIN') return res.status(403)

	try {
		await dbConnect()

		switch (req.method) {
			case 'DELETE': {
				const committee = await Committee.findByIdAndDelete(req.query.committeeId)
				await Library.updateOne(
					{ _id: 'Committees' },
					{ $pull: { content: committee?.name } }
				)
				break
			}

			default:
				res.setHeader('Allow', ['DELETE'])
				res.status(405).end(`Method ${req.method} Not Allowed`)
		}
	} catch (err) {
		console.log(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default committeeHandler