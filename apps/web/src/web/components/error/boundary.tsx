import React from 'react';
import Head from 'next/head';
import Layout from '../layout';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';

type State = Readonly<{
	closedAlert: boolean;
	error: Error | undefined;
}>;

class ErrorBoundary extends React.Component<
	Readonly<{
		router: NextRouter;
		children: React.ReactNode;
	}>,
	State
> {
	override state: State = {
		error: undefined,
		closedAlert: false,
	};

	static getDerivedStateFromError = (error: Error): State => {
		return {
			error,
			closedAlert: false,
		};
	};

	override componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
		console.error({ error, errorInfo });
		this.setState({ error });
	};

	override render = () => {
		return !this.state.error ? (
			this.props.children
		) : (
			<Layout title="Error">
				<Head>
					<title>Error</title>
				</Head>
				{this.state.closedAlert ? null : (
					//something
					<div>error</div>
				)}
			</Layout>
		);
	};
}

export default withRouter(ErrorBoundary);
