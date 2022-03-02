import Link from 'next/link'
import { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const navItems = [
	{ text: 'Personal Information', href: '/me' },
	{ text: 'Tutor Details', href: '/me/details' },
	{ text: 'Tutorial Sessions', href: '/me/sessions' },
]

const UserLayout: FC = ({ children }) => {
	const router = useRouter()
	const time = (new Date).getTime()
	const { status } = useSession({
		required: true,
		onUnauthenticated: () => {
			setTimeout(() => router.replace('/?error=You are not logged in.'), time + 500 - (new Date).getTime())
		}
	})

	if (status == 'loading') {
		return (
			<div className="flex justify-center items-center absolute h-screen w-screen z-10 top-0 left-0 bg-white">
				<div className="spinner-border animate-spin inline-block w-20 h-20 border-8 rounded-full text-blue-700" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto grid lg:grid-cols-9 xl:grid-cols-7 pt-12 px-6 md:px-8 lg:px-10">
			<div className="lg:col-span-2 xl:col-span-1">
				{navItems.map(item => (
					<Link key={item.href} href={item.href} passHref>
						<div className="block cursor-pointer text-gray-700 hover:text-gray-900 mb-4">
							{item.text}
						</div>
					</Link>
				))}
			</div>
			<div className="lg:col-span-7 xl:col-span-6">
				{children}
			</div>
		</div>
	)
}

export default UserLayout
