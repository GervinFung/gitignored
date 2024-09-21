import type { Supabase } from '../supabase';

import { Scrapper } from '../../scrapper';
import { supabase } from '../supabase';

import { TemplatePersistence } from './template';
import { TemplateBatchPersistence } from './template-batch';

class Persistence {
	private readonly props: Readonly<{
		database: Supabase;
		scrapper: Scrapper;
	}>;

	private readonly persistences: Readonly<{
		templateBatch: TemplateBatchPersistence;
		template: TemplatePersistence;
	}>;

	private constructor() {
		const params = {
			persistence: this,
		};

		this.props = {
			database: supabase(),
			scrapper: Scrapper.create(),
		};

		this.persistences = {
			templateBatch: new TemplateBatchPersistence(params),
			template: new TemplatePersistence(params),
		};
	}

	private static persistence: Persistence | undefined = undefined;

	static readonly instance = () => {
		switch (typeof this.persistence) {
			case 'undefined': {
				this.persistence = new Persistence();
			}
		}

		return this.persistence;
	};

	readonly scrapper = () => {
		return this.props.scrapper;
	};

	readonly database = () => {
		return this.props.database;
	};

	readonly templateBatch = () => {
		return this.persistences.templateBatch;
	};

	readonly template = () => {
		return this.persistences.template;
	};
}

export { Persistence };
