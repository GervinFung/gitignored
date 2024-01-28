import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import { externalAppRoutes } from './external/app';
import { internalAppRouter } from './internal/_app';

const trpc = initTRPC.create({
	transformer: superjson,
});

type Trpc = typeof trpc;

const createContext = () => {
	return {};
};

class Routes {
	private readonly props: ReturnType<Routes['create']>;

	private constructor() {
		this.props = this.create();
	}

	private static routes: Routes | undefined = undefined;

	static readonly instance = () => {
		switch (typeof this.routes) {
			case 'undefined': {
				this.routes = new this();
			}
		}

		return this.routes;
	};

	readonly create = () => {
		const external = externalAppRoutes(trpc);

		const internal = internalAppRouter(trpc);

		return {
			internal,
			external: trpc.createCallerFactory(external)(createContext()),
		};
	};

	readonly external = () => {
		return this.props.external;
	};

	readonly internal = () => {
		return this.props.internal;
	};

	// test only
	readonly createTestInternalCaller = () => {
		return trpc.createCallerFactory(this.internal())(createContext());
	};
}

export type { Trpc };

export { createContext };

export default Routes;
