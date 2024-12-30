import {Dated} from "./dated";

/**
 * Definition of a form.
 */
interface FormDefinition extends Dated {
	/**
	 * Form ID
	 */
	id: string

	/**
	 * A form's display name.
	 */
	displayName: string
}

export type { FormDefinition }
