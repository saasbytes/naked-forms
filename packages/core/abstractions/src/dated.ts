/**
 * Interface for objects that have a creation time.
 */
interface Dated {
	/**
	 * Time at which the object was created. Measured in seconds since the Unix epoch.
	 */
	created: number
}

export type { Dated }
