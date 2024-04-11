import Head from 'next/head';

export default function MyHead({ title }: { title?: string }) {
	return (
		<Head>
			<title>{`Open Light Master ${title ?? ''}`}</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
}
