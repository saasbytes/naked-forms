import {Dated} from "./dated";

interface Workspace extends Dated {
	/**
	 * Workspace ID
	 */
	id: string

	/**
	 * A workspace's name.
	 */
	name: string
}
